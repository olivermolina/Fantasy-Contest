import { prisma } from '~/server/prisma';

export const findLeadersByContest = async (
  contestId: string[],
  userId: string,
) => {
  const topLeaders: any = await prisma.wallets.findMany({
    where: {
      contestsId: { in: contestId },
    },
    select: {
      balance: true,
      User: {
        select: {
          id: true,
          username: true,
        },
      },
      contest: {
        select: {
          bgImageUrl: true,
        },
      },
    },
  });
  const rank = new Map<number, number>(
    topLeaders.map((wallet: { balance: number }, index: number) => [
      wallet.balance,
      index,
    ]),
  );
  const rankedLeaders = topLeaders.map((currentWallet: { balance: number }) => {
    const values: number[] = Array.from(rank.values());
    return {
      rank: rank.get(currentWallet.balance),
      isTopRanked: Math.max(...values) == rank.get(currentWallet.balance),
      ...currentWallet,
    };
  });
  return rankedLeaders.map(
    (wallet: {
      User: { id: string; username: string };
      isTopRanked: boolean;
      contest: { bgImageUrl: string };
      balance: string;
      rank: number;
    }) => ({
      id: wallet.User.id,
      name: wallet.User.username,
      isTopRanked: wallet.isTopRanked,
      bgImageUrl: wallet.contest.bgImageUrl,
      points: parseInt(wallet.balance),
      rank: wallet.rank,
      isMe: wallet.User.id == userId,
    }),
  );
};
