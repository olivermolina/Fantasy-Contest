import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { ContestDetailModalProps } from '~/components/ContestDetail/ContestDetailModal';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';

const getById = isAuthenticated
  .input(
    yup.object({
      id: yup.string().required(),
    }),
  )
  .output(
    yup.mixed<Pick<
      ContestDetailModalProps,
      'entries' | 'imgUrl' | 'name' | 'overview' | 'prizes'
    > | null>(),
  )
  .query(async ({ ctx, input }) => {
    if (!ctx.session.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    const contestId = input.id;
    if (!contestId) {
      return null;
    }
    const contest = await prisma.contest.findFirstOrThrow({
      where: {
        id: contestId,
      },
      include: {
        ContestEntries: {
          include: {
            User: true,
          },
        },
      },
    });
    return {
      imgUrl: contest.bgImageUrl,
      name: contest.name,
      overview: {
        content: contest.description,
      },
      entries: contest.ContestEntries.sort(
        (a, b) => a.tokens.toNumber() - b.tokens.toNumber(),
      )
        .splice(0, 3)
        .map((entry, i) => ({
          id: entry.id,
          entryNumber: i,
          name: entry.User.username!,
        })),
      prizes: [
        {
          rank: 1,
          amount: 50,
        },
        {
          rank: 2,
          amount: 25,
        },
        {
          rank: 3,
          amount: 10,
        },
      ],
    };
  });

export default getById;
