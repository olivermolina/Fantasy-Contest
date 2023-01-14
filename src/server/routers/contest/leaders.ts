import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';

const leaders = t.procedure
  .input(
    yup.object({
      contestId: yup.string().required(),
    }),
  )
  .output(
    yup.array(
      yup.object({
        id: yup.string().uuid().required(),
        name: yup.string().required(),
        isTopRanked: yup.bool().required(),
        bgImageUrl: yup.string().url().required(),
        points: yup.number().required(),
        rank: yup.number().required(),
      }),
    ),
  )
  .query(async ({ ctx, input }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    const Wallets: any = await prisma.wallets.findMany({
      where: {
        contestsId: input.contestId || undefined,
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
    const userId = ctx.session.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      });
    }

    const rank = new Map<number, number>(
      Wallets.map((wallet: { balance: number }, index: number) => [
        wallet.balance,
        index,
      ]),
    );
    const rankedLeaders = Wallets.map((currentWallet: { balance: number }) => {
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
      }),
    );
  });

export default leaders;
