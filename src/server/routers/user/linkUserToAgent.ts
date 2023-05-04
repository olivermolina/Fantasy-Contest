import { prisma } from '~/server/prisma';
import { getAgentByReferralCode } from './getAgentByReferralCode';

/**
 * This function will link all the Users to the Agent if it's not connected yet
 */
export const linkUserToAgent = async () => {
  // Get all users with referral with missing agent
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        referral: null,
      },
      agentId: null,
    },
  });

  // Link each user to the agent
  return await Promise.all([
    ...users.map(async (user) => {
      const { id, referral } = user;
      if (!referral) return user;
      const agent = await getAgentByReferralCode(referral);
      return await prisma.user.update({
        where: {
          id,
        },
        data: {
          agentId: agent?.id,
        },
      });
    }),
  ]);
};
