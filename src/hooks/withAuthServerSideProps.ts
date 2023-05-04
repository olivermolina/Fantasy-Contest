import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { supabase } from '~/utils/supabaseClient';
import { UrlPaths } from '~/constants/UrlPaths';
import prisma from '~/server/prisma';
import { UserType } from '@prisma/client';
import { findKey } from 'lodash';

/**
 * Higher Order Function for server-side authentication
 * @param {GetServerSideProps} gssp - The original GetServerSideProps function to be wrapped
 * @param role - USER or ADMIN
 * @returns {Function} - Returns a new function with the added authentication check
 * @throws {Object} - Returns an object with a redirect property if the user is not authenticated
 */
export const withAuth = (
  gssp: GetServerSideProps,
  role: 'ADMIN' | 'USER' = 'USER',
) => {
  /**
   * New function with added authentication check
   * @param {GetServerSidePropsContext} context - The context object passed to the GetServerSideProps function
   * @returns {Promise<any>} - Returns the result of the original GetServerSideProps function or an object with a redirect property if the user is not authenticated
   */
  return async (context: GetServerSidePropsContext) => {
    const user = await supabase.auth.api.getUserByCookie(
      context.req,
      context.res,
    );

    if (!user.user) {
      return {
        redirect: {
          permanent: false,
          destination: UrlPaths.Login,
        },
      };
    }

    try {
      const prismaUser = await prisma.user.findFirstOrThrow({
        where: {
          id: user.user.id,
        },
      });

      // If the user is not a player and trying to access non-admin page, redirect to the admin page
      if (
        role === 'USER' &&
        [UserType.SUB_ADMIN.toString(), UserType.AGENT.toString()].includes(
          prismaUser.type,
        )
      ) {
        return {
          redirect: {
            permanent: false,
            destination: UrlPaths.Admin,
          },
        };
      }

      if (role === 'ADMIN') {
        // If the user is not an admin, redirect to the challenge page
        if (prismaUser.type === UserType.PLAYER) {
          return {
            redirect: {
              permanent: false,
              destination: UrlPaths.Challenge,
            },
          };
        }

        const { resolvedUrl } = context;
        // If the user is a sub-admin or an agent, check if the role is allowed to access the admin page
        if (
          resolvedUrl !== UrlPaths.Admin &&
          [UserType.SUB_ADMIN.toString(), UserType.AGENT.toString()].includes(
            prismaUser.type,
          )
        ) {
          // Get the path key from the UrlPaths object
          const urlPathKey = findKey(
            UrlPaths,
            (value) => value === resolvedUrl,
          );
          try {
            await prisma.permission.findFirstOrThrow({
              where: {
                userId: prismaUser.id,
                module: {
                  urlPath: urlPathKey,
                },
                read: true,
                write: true,
              },
            });
          } catch (e) {
            // Redirect user to the access denied page if no permission found
            return {
              redirect: {
                permanent: false,
                destination: UrlPaths.AccessDenied,
              },
            };
          }
        }
      }
    } catch (e) {
      return {
        redirect: {
          permanent: false,
          destination: UrlPaths.Login,
        },
      };
    }

    return await gssp(context);
  };
};
