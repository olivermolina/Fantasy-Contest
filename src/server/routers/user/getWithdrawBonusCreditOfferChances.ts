import dayjs from 'dayjs';
import { DayOfWeek } from '~/constants/DayOfWeek';
import weekday from 'dayjs/plugin/weekday';
import en from 'dayjs/locale/en';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';
import prisma from '~/server/prisma';
import { ActionType } from '~/constants/ActionType';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import { AppSettingName, TransactionType } from '@prisma/client';

dayjs.extend(weekday);
dayjs.locale({
  ...en,
  weekStart: 1,
});

/**
 * This will get how many withdraw offer chances the user can have in a week
 */
const getWithdrawBonusCreditOfferChances = isAuthenticated.query(
  async ({ ctx }) => {
    const userId = ctx.session.user?.id;

    const fromDateString = dayjs()
      .weekday(DayOfWeek.MONDAY)
      .format('YYYY-MM-DD');
    const toDateString = dayjs().weekday(DayOfWeek.SUNDAY).format('YYYY-MM-DD');

    const retentionBonusWeeklyChance = await prisma.appSettings.findFirst({
      where: {
        name: AppSettingName.RETENTION_BONUS_WEEKLY_CHANCE,
      },
    });

    const weeklyChances = Number(retentionBonusWeeklyChance?.value || 0);

    if (weeklyChances === 0) return 0;

    const withdrawBonusCreditTransactionCount = await prisma.transaction.count({
      where: {
        userId: userId,
        actionType: ActionType.WITHDRAW_BONUS_CREDIT,
        created_at: {
          gte: new Date(fromDateString),
          lte: new Date(toDateString),
        },
        TransactionStatuses: {
          every: {
            statusCode: PaymentStatusCode.COMPLETE,
            transactionType: TransactionType.CREDIT,
          },
        },
        NOT: {
          TransactionStatuses: {
            none: {},
          },
        },
      },
    });

    if (withdrawBonusCreditTransactionCount > weeklyChances) {
      return 0;
    }

    return weeklyChances - withdrawBonusCreditTransactionCount;
  },
);

export default getWithdrawBonusCreditOfferChances;
