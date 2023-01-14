import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { Contest, ContestEntry, ContestWagerType } from '@prisma/client';
import { canJoinContest } from '~/server/routers/contest/canJoinContest';
import * as yup from '~/utils/yup';
import { InferType } from '~/utils/yup';
import { findLeadersByContest } from '~/server/routers/contest/findLeadersByContest';

const baseMatch = {
  id: yup.string().uuid().required(),
  away: yup.object().required(),
  home: yup.object().required(),
  matchTime: yup.date().required(),
};
const fantasyMatch = yup.object({
  ...baseMatch,
  playerPhotoURL: yup.string().required(),
  statName: yup.string().required(),
  total: yup.number().required(),
  matchName: yup.string().required(),
  playerName: yup.string().required(),
  tags: yup.array(yup.string()).required(),
});
export type FantasyMatchType = InferType<typeof fantasyMatch>;

const contests = t.procedure
  .output(
    yup.array(
      yup.object({
        id: yup.string().uuid().required(),
        name: yup.string().required(),
        isActive: yup.bool().required(),
        bgImageUrl: yup.string().url().required(),
        startDate: yup.date().required(),
        endDate: yup.date().required(),
        isEnrolled: yup.bool().required(),
        isJoinable: yup.bool().required(),
        entryFee: yup.number().required(),
        totalPrize: yup.number().required(),
        entries: yup.number().required(),
        leaders: yup
          .array(
            yup.object({
              id: yup.string().uuid().required(),
              name: yup.string().required(),
              isTopRanked: yup.bool().required(),
              bgImageUrl: yup.string().url().required(),
              points: yup.number().required(),
              rank: yup.number().required(),
              isMe: yup.bool().required(),
            }),
          )
          .nullable(),
      }),
    ),
  )
  .query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    const contests: any = await prisma.contest.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
        bgImageUrl: true,
        startDate: true,
        endDate: true,
        entryFee: true,
        totalPrize: true,
        ContestEntries: {
          select: {
            id: true,
            tokens: true,
            userId: true,
            contestsId: true,
          },
        },
      },
      where: {
        wagerType: ContestWagerType.TOKEN,
      },
    });
    const userId = ctx.session.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      });
    }

    const result = await findLeadersByContest(
      contests.map(
        (contest: Contest & { ContestEntries: ContestEntry[] }) => contest.id,
      ),
      userId,
    );
    return contests.map(
      (contest: Contest & { ContestEntries: ContestEntry[] }) => ({
        id: contest.id,
        name: contest.name,
        isActive: contest.isActive,
        bgImageUrl: contest.bgImageUrl,
        startDate: contest.startDate,
        endDate: contest.endDate,
        isEnrolled: contest.ContestEntries.some(
          (entry) => entry.userId === userId,
        ),
        isJoinable: canJoinContest(contest, userId),
        entryFee: contest.entryFee,
        totalPrize: contest.totalPrize,
        entries: contests.length,
        leaders: [...result],
      }),
    );
  });

export default contests;
