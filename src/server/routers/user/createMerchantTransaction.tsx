import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import GIDX, { IDeviceGPS } from '~/lib/tsevo-gidx/GIDX';
import ShortUniqueId from 'short-unique-id';
import { ActionType } from '~/constants/ActionType';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';

const createMerchantTransaction = isAuthenticated
  .input(
    yup.object({
      ipAddress: yup.string().required(),
      deviceGPS: yup.mixed<IDeviceGPS>().required(),
      amountProcess: yup.number().required(),
      amountBonus: yup.number().required(),
      serviceType: yup.mixed<ActionType>().required(),
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
        message: CustomErrorMessages.USER_NOT_FOUND,
      });
    }

    try {
      // Create new session
      const { ipAddress, amountProcess, amountBonus, deviceGPS, serviceType } =
        input;

      const session = await prisma.session.create({
        data: {
          userId: user.id,
          serviceType,
          deviceLocation: ipAddress,
          sessionRequestRaw: '',
        },
      });

      // Create new transaction
      const uid = new ShortUniqueId({ length: 16 });
      const transaction = await prisma.transaction.create({
        data: {
          id: uid(),
          sessionId: session.id,
          actionType: serviceType,
          userId: user.id,
          amountProcess,
          amountBonus: amountBonus,
          transactionCurrency: 'USD',
        },
      });

      const gidx = await new GIDX(user, serviceType, session);

      // Initialize transaction GIDX session
      const createSessionData = await gidx.createSession(
        transaction,
        ipAddress,
        deviceGPS,
      );

      if (!createSessionData) {
        return Promise.reject(Error('Invalid session'));
      }

      if (createSessionData.ResponseCode !== 0) {
        return Promise.reject(Error(createSessionData.ResponseMessage));
      }

      return {
        session,
        transaction,
        gidxSession: createSessionData,
      };
    } catch (err: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.ACCOUNT_TRANSACTION,
      });
    }
  });

export default createMerchantTransaction;
