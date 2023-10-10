import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import z from 'zod';
import { MORE_OR_LESS_CONTEST_ID } from '~/constants/MoreOrLessContestId';

/**
 * @description Save user wallet
 * @param {string} id - User id
 * @param {number} balance - User balance
 * @param {number} cashBalance - User cash balance
 * @param {number} bonusCredits - User bonus credits
 * @param {number} amountAvailableToWithdraw - User amount available to withdraw
 * @returns {Promise} Wallet
 */
const saveUserWallet = adminProcedure
  .input(
    z.object({
      id: z.string(),
      balance: z.number(),
      cashBalance: z.number(),
      bonusCredits: z.number(),
      amountAvailableToWithdraw: z.number(),
    }),
  )
  .mutation(async ({ input }) => {
    const { id, ...data } = input;
    return await prisma.wallets.update({
      where: {
        userId_contestsId: {
          userId: id,
          contestsId: MORE_OR_LESS_CONTEST_ID,
        },
      },
      data: {
        ...data,
        unPlayedAmount: data.cashBalance - data.amountAvailableToWithdraw,
      },
    });
  });

export default saveUserWallet;
