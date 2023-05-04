import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import en from 'dayjs/locale/en';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';
import { TransactionType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import createTransaction from '~/server/routers/bets/createTransaction';
import * as yup from '~/utils/yup';

dayjs.extend(weekday);
dayjs.locale({
  ...en,
  weekStart: 1,
});

const addWithdrawBonusCredit = isAuthenticated
  .input(
    yup.object({
      cashBalance: yup.number().required(),
      bonusCredit: yup.number().required(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user!.id;

    // Remove the available cash balance transaction
    await createTransaction({
      userId: userId,
      amountProcess: input.cashBalance,
      amountBonus: 0,
      transactionType: TransactionType.DEBIT,
      actionType: ActionType.WITHDRAW_BONUS_CREDIT,
    });

    // Increment the bonus credit
    await createTransaction({
      userId: userId,
      amountProcess: 0,
      amountBonus: input.bonusCredit,
      transactionType: TransactionType.CREDIT,
      actionType: ActionType.WITHDRAW_BONUS_CREDIT,
    });

    return 'Withdraw bonus credit successfully added!';
  });

export default addWithdrawBonusCredit;
