import { t } from '../../trpc';
import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import { BetInputType, placeBet } from './placeBet';
import { listBets } from './listBets';
import { grade } from './grade';
import pendingBetLegs from './pendingBetLegs';
import getManualOffersWithPendingBets from './getManualOffersWithPendingBets';
import { createMissingWinTransaction } from './createMissingWinTransaction';
import { isAuthenticated } from '../middleware/isAuthenticated';

export const betsRouter = t.router({
  list: listBets,
  placeBet: isAuthenticated
    .input(yup.mixed<BetInputType>().required())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      return placeBet(input, ctx.session.user);
    }),
  grade,
  pendingBetLegs,
  getManualOffersWithPendingBets,
  createMissingWinTransaction,
});
