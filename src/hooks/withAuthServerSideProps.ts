import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { UrlPaths } from '~/constants/UrlPaths';
import prisma from '~/server/prisma';
import { UserType } from '@prisma/client';
import { findKey, replace } from 'lodash';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

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
    // Create authenticated Supabase Client.
    const supabase = createPagesServerClient(context);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        redirect: {
          permanent: false,
          destination: UrlPaths.Login + '?redirect=' + context.resolvedUrl,
        },
      };
    }

    try {
      const prismaUser = await prisma.user.findFirstOrThrow({
        where: {
          id: session.user.id,
        },
      });

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
        // If the user is a sub-admin or an agent, check if the role is allowed to access the admin/partners page
        if (
          resolvedUrl !== UrlPaths.Admin &&
          resolvedUrl !== UrlPaths.Partners &&
          [UserType.SUB_ADMIN.toString(), UserType.AGENT.toString()].includes(
            prismaUser.type,
          )
        ) {
          // Replace partners with admin in the url to get the module path url key
          const adminPathKey = replace(resolvedUrl, 'partners', 'admin');
          // Get the path key from the UrlPaths object
          const urlPathKey = findKey(
            UrlPaths,
            (value) => value === adminPathKey,
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

          if (
            prismaUser.type === UserType.AGENT &&
            resolvedUrl.includes('/admin')
          ) {
            // Redirect agent type to the partners page
            const partnerDestination = replace(
              resolvedUrl,
              'admin',
              'partners',
            );
            return {
              redirect: {
                permanent: false,
                destination: partnerDestination,
              },
            };
          }
        }

        if (
          prismaUser.type === UserType.AGENT &&
          resolvedUrl === UrlPaths.Admin
        ) {
          // Redirect agent type to the partners home page
          return {
            redirect: {
              permanent: false,
              destination: UrlPaths.Partners,
            },
          };
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
