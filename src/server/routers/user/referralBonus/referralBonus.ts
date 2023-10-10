import prisma from '~/server/prisma';
import {
  AppSettingName,
  TransactionType,
  User,
  UserType,
} from '@prisma/client';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { ActionType } from '~/constants/ActionType';
import { getUserSettings } from '~/server/routers/appSettings/list';
import { DefaultAppSettings } from '~/constants/AppSettings';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import en from 'dayjs/locale/en';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import { DayOfWeek } from '~/constants/DayOfWeek';

dayjs.extend(weekday);
dayjs.locale({
  ...en,
  weekStart: 1,
});

/**
 * This function will add bonus to a referrer user
 * after a successful first deposit of he/she refers
 *
 * @param referredUser Prisma.User object
 *
 */
const addReferralBonus = async (referredUser: User) => {
  if (!referredUser.isFirstDeposit) {
    return;
  }

  // Set isFirstDeposit=false after a successful deposit
  await prisma.user.update({
    where: { id: referredUser.id },
    data: {
      isFirstDeposit: false,
    },
  });
  let user = await prisma.user.findFirst({
    where: {
      // Get the user using the referral from the referred user
      username: referredUser.referral,
      // Only the PLAYER user type will be rewarded with a referral bonus
      type: UserType.PLAYER,
    },
  });

  if (!user && referredUser.referral) {
    // Find user from the referral codes table
    const referralCode = await prisma.referralCode.findFirst({
      where: {
        // Get the user using the referral from the referred user
        code: referredUser.referral,
      },
      select: {
        User: true,
      },
    });

    user = referralCode?.User || null;
  }

  if (user && user.type === UserType.PLAYER) {
    const { userAppSettings: appSettings } = await getUserSettings(user.id);
    const referralMaxAmountEarnedLimit = Number(
      appSettings.find(
        (s) => s.name === AppSettingName.WEEKLY_REFERRAL_MAX_AMOUNT_EARNED,
      )?.value || DefaultAppSettings.WEEKLY_REFERRAL_MAX_AMOUNT_EARNED,
    );

    const referralCreditAmount = Number(
      appSettings.find((s) => s.name === AppSettingName.REFERRAL_CREDIT_AMOUNT)
        ?.value || DefaultAppSettings.REFERRAL_CREDIT_AMOUNT,
    );

    const fromDateString = dayjs()
      .weekday(DayOfWeek.MONDAY)
      .format('YYYY-MM-DD');
    const toDateString = dayjs().weekday(DayOfWeek.SUNDAY).format('YYYY-MM-DD');

    const weeklyTotalReferralCreditAmount = await prisma.transaction.aggregate({
      where: {
        userId: user.id,
        actionType: ActionType.REFERRAL_FREE_CREDIT,
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
      _sum: {
        amountBonus: true,
      },
    });

    // Check if the user has not reached the weekly referral max amount earned limit yet
    // before adding the referral bonus to the user
    if (
      referralMaxAmountEarnedLimit >
      Number(weeklyTotalReferralCreditAmount?._sum?.amountBonus)
    ) {
      await createTransaction({
        userId: user.id,
        amountProcess: 0,
        amountBonus: Number(referralCreditAmount) || 0,
        actionType: ActionType.REFERRAL_FREE_CREDIT,
        transactionType: TransactionType.CREDIT,
      });
    }
  }
};

export default addReferralBonus;
