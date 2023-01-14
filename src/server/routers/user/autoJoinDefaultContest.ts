import { getMoreLessContest } from '~/server/routers/contest/createMoreLessContest';
import { prisma } from '~/server/prisma';

export const autoJoinDefaultContest = async (userId: string) => {
  const moreOrLessContest = await getMoreLessContest();
  const userContestEntry = await prisma.contestEntry.findFirst({
    where: {
      contestsId: moreOrLessContest.id,
      userId,
    },
  });
  if (!userContestEntry) {
    await prisma.contestEntry.create({
      data: {
        userId: userId,
        contestsId: moreOrLessContest.id,
        tokens: 0,
      },
    });

    await prisma.wallets.create({
      data: {
        balance: 1000,
        userId: userId,
        contestsId: moreOrLessContest.id,
        created_by: '',
        updated_by: '',
      },
    });
  }
};
