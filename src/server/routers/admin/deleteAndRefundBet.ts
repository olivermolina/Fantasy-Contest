import { adminProcedure } from './middleware/isAdmin';
import { z } from 'zod';
import prisma from '~/server/prisma';
import { BetStatus } from '@prisma/client';
import { settleBet } from '../bets/grade';

export const innerFn = async ({ input }: { input: { betId: string } }) => {
  const bet = await prisma.bet.update({
    where: {
      id: input.betId,
    },
    data: {
      status: BetStatus.REFUNDED,
      legs: {
        updateMany: {
          where: {
            betId: input.betId,
          },
          data: {
            status: BetStatus.REFUNDED,
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
 * Deletes and refunds a bet, updating its status and the statuses of its legs
 * @function
 * @async
 * @param {Object} input - Input object containing the betId
 * @param {string} input.betId - ID of the bet to delete and refund
 * @returns {void}
 */
export const deleteAndRefundBet = adminProcedure
  .input(
    z.object({
      betId: z.string(),
    }),
  )
  .mutation(innerFn);
