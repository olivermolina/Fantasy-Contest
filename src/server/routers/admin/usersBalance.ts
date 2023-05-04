import { User } from '@prisma/client';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import getUserTotalBalance, {
  UserTotalBalanceInterface,
} from '../user/userTotalBalance/getUserTotalBalance';
import { adminProcedure } from './middleware/isAdmin';
import { setPlayerWhereFilter } from '~/server/routers/user/users';

export type UserBalance = User & UserTotalBalanceInterface;

const usersBalance = adminProcedure
  .input(
    yup.object({
      limit: yup.number(),
      cursor: yup.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;

    const where = {};
    setPlayerWhereFilter(ctx.user, where);
    const totalRowCount = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (users.length > limit) {
      const nextItem = users.pop();
      nextCursor = nextItem?.id;
    }

    const usersBalancePromise = [];

    for (const user of users) {
      usersBalancePromise.push({
        ...user,
        ...(await getUserTotalBalance(user.id)),
      });
    }

    const usersBalance = await Promise.all(usersBalancePromise);

    return {
      usersBalance,
      nextCursor,
      meta: {
        totalRowCount,
      },
    };
  });

export default usersBalance;
