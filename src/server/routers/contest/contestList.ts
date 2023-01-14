import { t } from '~/server/trpc';
import { Contest } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { canJoinContest } from '~/server/routers/contest/canJoinContest';
import * as yup from '~/utils/yup';

const contestList = t.procedure
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
        type: yup.mixed<Contest['type']>(),
        wagerType: yup.mixed<Contest['wagerType']>().required(),
      }),
    ),
  )
  .query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    const contests = await prisma.contest.findMany({
      include: {
        ContestEntries: true,
      },
      orderBy: {
        priority: 'asc',
      },
    });
    const userId = ctx.session.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      });
    }
    return contests.map((contest) => ({
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
      wagerType: contest.wagerType,
      type: contest.type,
    }));
  });

export default contestList;
