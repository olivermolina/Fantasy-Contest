import { adminProcedure } from './middleware/isAdmin';
import { z } from 'zod';
import prisma from '~/server/prisma';
import { BetStatus } from '@prisma/client';
import { settleBet } from '../bets/grade';

export const innerFn = async ({
  input,
}: {
  input: { betId: string; betStatus: BetStatus };
}) => {
  const bet = await prisma.bet.update({
    where: {
      id: input.betId,
    },
    data: {
      status: input.betStatus,
      legs: {
        updateMany: {
          where: {
            betId: input.betId,
          },
          data: {
            status: input.betStatus,
          },
        },
      },
    },
    include: {
      legs: true,
      ContestEntries: {
        include: {
          contest: true,
        },
      },
      ContestCategory: true,
    },
  });

  await settleBet(bet);
};
/**
 * Manually settle a pending bet, updating its status and the statuses of its legs
 * @function
 * @async
 * @param {Object} input - Input object containing the betId
 * @param {string} input.betId - ID of the bet to delete and refund
 * @returns {void}
 */
export const settlePendingBet = adminProcedure
  .input(
    z.object({
      betId: z.string(),
      betStatus: z.nativeEnum(BetStatus),
    }),
  )
  .mutation(innerFn);
