import { prisma } from '~/server/prisma';
import { UserType } from '@prisma/client';

/**
 * This function will get the Agent using the user's referral code
 *
 * @param referral {string} The user's referral code
 *
 */
export const getAgentByReferralCode = async (referral: string) => {
  let user = await prisma.user.findUnique({
    where: {
      username: referral,
    },
  });

  if (!user) {
    const referralCode = await prisma.referralCode.findFirst({
      where: {
        code: referral,
      },
      select: {
        User: true,
      },
    });
    user = referralCode?.User || null;
  }

  if (!user) {
    return null;
  }

  if (user?.type === UserType.PLAYER) {
    return {
      id: null,
      User: user,
    };
  }

  return await prisma.agent.findFirst({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      User: true,
    },
  });
};
