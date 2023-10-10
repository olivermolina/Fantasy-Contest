import { BonusCreditLimit, UserBonusCreditLimit } from '@prisma/client';

export const mapUserBonusCreditLimits = (
  userId: string,
  bonusCreditLimits: (BonusCreditLimit & {
    contestCategoryId: string;
    numberOfPicks: number;
  })[],
  userBonusCreditLimits: UserBonusCreditLimit[],
) => {
  return bonusCreditLimits.map((bonusCreditLimit) => {
    const userBonusCreditLimit = userBonusCreditLimits.find(
      (userBonusCreditLimit) =>
        userBonusCreditLimit.bonusCreditLimitId === bonusCreditLimit.id &&
        userBonusCreditLimit.userId === userId,
    );

    return {
      ...bonusCreditLimit,
      id: userBonusCreditLimit?.id || 'NEW',
      enabled:
        (userBonusCreditLimit
          ? userBonusCreditLimit.enabled
          : bonusCreditLimit.enabled) || false,
      bonusCreditFreeEntryEquivalent: Number(
        userBonusCreditLimit
          ? userBonusCreditLimit.bonusCreditFreeEntryEquivalent
          : bonusCreditLimit.bonusCreditFreeEntryEquivalent,
      ),
      stakeTypeOptions: userBonusCreditLimit
        ? userBonusCreditLimit.stakeTypeOptions
        : bonusCreditLimit.stakeTypeOptions,
    };
  });
};
