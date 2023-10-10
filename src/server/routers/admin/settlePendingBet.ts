import { adminProcedure } from './middleware/isAdmin';
import { z } from 'zod';
import prisma from '~/server/prisma';
import { Bet, BetStatus } from '@prisma/client';
import { settleBet } from '../bets/grade';
import { getUserSettings } from '~/server/routers/appSettings/list';
import { MORE_OR_LESS_CONTEST_ID } from '~/constants/MoreOrLessContestId';

/**
 * Remove the transaction associated with a bet and update the user wallet
 * @param bet
 */
const removeBetTransaction = async (bet: Bet) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      betId: bet.id,
    },
  });

  // If the transaction exists, delete it and update the wallet
  if (transaction) {
    await prisma.transaction.delete({
      where: {
        id: transaction.id,
      },
    });
    const contestEntry = await prisma.contestEntry.findUnique({
      where: {
        id: transaction.contestEntryId ?? '',
      },
    });

    const wallet = await prisma.wallets.findFirst({
      where: {
        userId: transaction.userId,
        contestsId: contestEntry?.contestsId || MORE_OR_LESS_CONTEST_ID,
      },
    });

    const currentBalance =
      Number(wallet?.balance) -
      (Number(transaction.amountProcess) + Number(transaction.amountBonus));

    const currentCashBalance =
      Number(wallet?.cashBalance) - Number(transaction.amountProcess);

    await prisma.wallets.update({
      where: {
        userId_contestsId: {
          userId: transaction.userId,
          contestsId: contestEntry?.contestsId || MORE_OR_LESS_CONTEST_ID,
        },
      },
      data: {
        balance: currentBalance,
        cashBalance: currentCashBalance,
        amountAvailableToWithdraw: {
          decrement: transaction.amountProcess,
        },
        // If the amount available to withdraw is greater than the cash balance, set the unplayed amount to 0
        unPlayedAmount: Math.min(
          currentCashBalance - Number(wallet?.amountAvailableToWithdraw),
          0,
        ),
        bonusCredits: {
          decrement: transaction.amountBonus,
        },
      },
    });
  }
};

export const innerFn = async ({
  input,
}: {
  input: { betId: string; betStatus: BetStatus };
}) => {
  const previousBet = await prisma.bet.findUnique({
    where: {
      id: input.betId,
    },
  });

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
      legs: {
        include: {
          market: {
            include: {
              offer: true,
            },
          },
        },
      },
      ContestEntries: {
        include: {
          contest: true,
        },
      },
      ContestCategory: true,
    },
  });
  const { leagueLimits } = await getUserSettings(bet.userId);

  // If the bet is pending/loss, remove the win/canceled/refunded transaction if it exists
  if (
    input.betStatus === BetStatus.PENDING ||
    input.betStatus === BetStatus.LOSS
  ) {
    await removeBetTransaction(bet);
  } else if (
    // If the bet is win and the previous bet was canceled or refunded, remove canceled/refunded transaction
    input.betStatus === BetStatus.WIN &&
    (previousBet?.status === BetStatus.CANCELLED ||
      previousBet?.status === BetStatus.REFUNDED)
  ) {
    await removeBetTransaction(bet);
  } else if (
    // If the bet is refunded/canceled and the previous bet was win, remove win transaction
    (input.betStatus === BetStatus.CANCELLED ||
      input.betStatus === BetStatus.REFUNDED) &&
    previousBet?.status === BetStatus.WIN
  ) {
    await removeBetTransaction(bet);
  }

  // If the bet is not pending, settle it immediately (this is for when a bet is settled manually)
  if (input.betStatus !== BetStatus.PENDING) {
    await settleBet(bet, leagueLimits);
  }
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
