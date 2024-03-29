import { Agent, AgentSubAdmin, User, UserType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { Context } from '~/server/context';
import { t } from '~/server/trpc';
import { BaseMiddlewareFunctionType } from '../../middleware/BaseMiddlewareFunctionType';
import { getUser } from './getUser';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

export type AgentUsersType = Agent & { users: User[] };

export type UpdatedContext = Context & {
  user: User & {
    UserAsAgents: AgentUsersType[];
    AgentSubAdmins: (AgentSubAdmin & {
      Agent: Agent & {
        User: User;
        users: User[];
      };
    })[];
  };
};

// const baseMiddleware = ;

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
  const user = await getUser(userId);

  if (!user || user.type === UserType.PLAYER) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: CustomErrorMessages.UNAUTHORIZED_ROLE,
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
};

const isAdmin = t.middleware(middlewareFn);

export const adminProcedure = t.procedure.use(isAdmin);
