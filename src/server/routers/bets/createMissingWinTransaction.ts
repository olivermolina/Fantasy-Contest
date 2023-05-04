import { t } from '../../trpc';
import logger from '~/utils/logger';
import { BetStatus, TransactionType } from '@prisma/client';
import * as yup from '~/utils/yup';
import { TOKEN } from '~/constants/TOKEN';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import createTransaction from './createTransaction';
import { ActionType } from '~/constants/ActionType';

/**
 *  This will insure all settled WIN bets to have a win transaction
 * @async
 * @param {string} token - etl token
 * @returns {void}
 */
export const createMissingWinTransaction = t.procedure
  .input(
    yup
      .mixed<{
        token: string;
      }>()
      .required(),
  )
  .mutation(async ({ input }) => {
    if (input.token !== TOKEN) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    try {
      const winBetsWithNoTransactions = await prisma.bet.findMany({
        where: {
          Transactions: {
            none: {},
          },
          status: BetStatus.WIN,
        },
      });

      await Promise.all(
        winBetsWithNoTransactions.map(
          async (bet) =>
            await createTransaction({
              userId: bet.userId,
              amountProcess: Number(bet.payout),
              amountBonus: 0,
              actionType: ActionType.CASH_CONTEST_WIN,
              transactionType: TransactionType.CREDIT,
              betId: bet.id,
            }),
        ),
      );

      return winBetsWithNoTransactions;
    } catch (error) {
      logger.error(
        'There was an error processing missing win transactions.',
        error,
      );
      throw error;
    }
  });
