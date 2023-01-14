import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { Session } from '@prisma/client';
import { mapValues } from 'lodash';
import dayjs from 'dayjs';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import GIDX, { IDeviceGPS, isBlocked, isVerified } from '~/lib/tsevo-gidx/GIDX';
import { ActionType } from '~/constants/ActionType';
import { getErrorMessage } from '~/utils/geErrorMessage';

const accountVerify = t.procedure
  .input(
    yup.object({
      session: yup.mixed<Session>(),
      deviceGPS: yup.mixed<IDeviceGPS>().required(),
      ipAddress: yup.string().required(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user?.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userId || !user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      });
    }

    const { session, deviceGPS, ipAddress } = input;

    if (!session) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid session!',
      });
    }

    if (!user.identityStatus) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.NOT_VERIFIED,
      });
    }

    const gidx = await new GIDX(user, ActionType.CUSTOMER_MONITOR, session);
    const customerMonitorResponse = await gidx.customerMonitor({
      deviceGPS,
      ipAddress,
    });

    if (!isVerified(customerMonitorResponse.ReasonCodes)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.NOT_VERIFIED,
      });
    }

    if (isBlocked(customerMonitorResponse.ReasonCodes)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: getErrorMessage(customerMonitorResponse.ReasonCodes),
      });
    }

    const {
      firstname,
      lastname,
      address1,
      address2,
      city,
      state,
      postalCode,
      DOB,
    } = user;
    return mapValues(
      {
        firstname,
        lastname,
        address1,
        address2,
        city,
        state,
        postalCode,
        dob: dayjs(DOB).format('YYYY-MM-DD'),
      },
      (v) => (v === null ? '' : v),
    );
  });

export default accountVerify;
