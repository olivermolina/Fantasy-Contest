import { TRPCError } from '@trpc/server';
import { ActionType } from '~/constants/ActionType';
import GIDX from '~/lib/tsevo-gidx/GIDX';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { getErrorMessage } from '~/utils/geErrorMessage';
import { User } from '@prisma/client';
import { BetInputType } from '~/server/routers/bets/placeBet';
import prisma from '~/server/prisma';
import { isVerified } from '~/utils/isVerified';
import { isBlocked } from '~/utils/isBlocked';
import specialRestrictions from '~/server/routers/contest/specialRestrictions';

/**
 * This function will monitor the user based of the location when they placed an entry
 * and will throw an error if it is not verified or has restrictions
 *
 * @params bet - user bet
 * @params user - prisma user object
 * @return void
 */
export const monitorUser = async (bet: BetInputType, user: User) => {
  if (process.env.NODE_ENV === 'development') return;

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      serviceType: ActionType.CUSTOMER_MONITOR,
      deviceLocation: '',
      sessionRequestRaw: '',
    },
  });
  const { deviceGPS, ipAddress } = bet;
  const gidx = new GIDX(user, ActionType.CUSTOMER_MONITOR, session);
  const customerMonitorResponse = await gidx.customerMonitor({
    deviceGPS,
    ipAddress,
  });
  const reasonCodes = customerMonitorResponse.ReasonCodes;

  if (!isVerified(reasonCodes)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: CustomErrorMessages.NOT_VERIFIED,
    });
  }

  if (isBlocked(reasonCodes, user.exemptedReasonCodes)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: getErrorMessage(reasonCodes),
    });
  }

  const leagues = bet.legs.map((leg) => leg.league);
  await specialRestrictions(reasonCodes, leagues);
};
