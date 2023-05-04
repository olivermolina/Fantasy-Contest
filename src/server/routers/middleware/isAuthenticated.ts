import { TRPCError } from '@trpc/server';
import { Context } from '~/server/context';
import { t } from '~/server/trpc';
import { BaseMiddlewareFunctionType } from './BaseMiddlewareFunctionType';

// This is the type of the context that will be passed to the next middleware or procedure.
type UpdatedContext = Context;

/**
 * Will fetch the user from the DB and check to see if they have admin privileges.
 * If they do they will add the user object to subsequent requests for procedural use.
 * @param params middleware parameters
 */
export const middlewareFn: BaseMiddlewareFunctionType<
  Context,
  UpdatedContext
> = async ({ ctx, next }) => {
  const userId = ctx.session.user?.id;

  if (!userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be authenticated to access this function.',
    });
  }

  return next({
    ctx,
  });
};

/**
 * Procedure that will check to see if the user is authenticated.
 */
export const isAuthenticated = t.procedure.use(t.middleware(middlewareFn));
