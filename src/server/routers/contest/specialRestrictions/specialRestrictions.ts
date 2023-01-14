import { League } from '@prisma/client';
import prisma from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { getErrorMessage } from '~/utils/geErrorMessage';

/**
 * Determine if a user has a special restriction based of the location code
 *
 * @param reasonCodes TSEVO monitor reason codes
 * @param leagues supported league enums in the application
 */

const specialRestrictions = async (
  reasonCodes: string[],
  leagues?: League[],
) => {
  const restrictions = await prisma.specialRestriction.findMany({
    where: {
      blockedReasonCodes: {
        isEmpty: false,
      },
    },
  });

  for (const restriction of restrictions) {
    const { code, blockedLeagues, blockedReasonCodes } = restriction;

    if (!reasonCodes.includes(code)) continue;

    const blockedReasonCodesFilter = reasonCodes.filter((reasonCode) =>
      blockedReasonCodes.includes(reasonCode),
    );

    if (blockedReasonCodesFilter && blockedReasonCodesFilter.length > 0) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: getErrorMessage(blockedReasonCodes),
      });
    }

    const blockedLeaguesFilter = leagues?.filter((league) =>
      blockedLeagues.includes(league),
    );

    if (blockedLeaguesFilter && blockedLeaguesFilter.length > 0) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: CustomErrorMessages.BLOCKED_COLLEGE_SPORTS_ERROR,
      });
    }
  }
};

export default specialRestrictions;
