import prisma from '~/server/prisma';
import {
  AppSettingName,
  TransactionType,
  User,
  UserType,
} from '@prisma/client';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { ActionType } from '~/constants/ActionType';

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
    const referralAppSetting = await prisma.appSettings.findFirst({
      where: {
        name: AppSettingName.REFERRAL_CREDIT_AMOUNT,
      },
    });
    await createTransaction({
      userId: user.id,
      amountProcess: 0,
      amountBonus: Number(referralAppSetting?.value) || 25,
      actionType: ActionType.ADD_FREE_CREDIT,
      transactionType: TransactionType.CREDIT,
    });
  }
};

export default addReferralBonus;
