import { User } from '@prisma/client';
import { prisma } from '~/server/prisma';
import getUserTotalBalance, {
  UserTotalBalanceInterface,
} from '../user/userTotalBalance/getUserTotalBalance';
import { adminProcedure } from './middleware/isAdmin';
import { setPlayerWhereFilter } from '~/server/routers/user/users';

export type UserBalance = User & UserTotalBalanceInterface;

const usersBalance = adminProcedure.query(async ({ ctx }) => {
  const where = {};
  setPlayerWhereFilter(ctx.user, where);

  const users = await prisma.user.findMany({
    where,
  });

  const usersBalancePromise = [];
  for (const user of users) {
    usersBalancePromise.push({
      ...user,
      ...(await getUserTotalBalance(user.id)),
    });
  }

  return await Promise.all(usersBalancePromise);
});

export default usersBalance;
