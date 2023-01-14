import { t } from '../trpc';
import * as yup from '~/utils/yup';
import GIDX, { GIDXDataBaseResponse } from '~/lib/tsevo-gidx/GIDX';
import { TRPCError } from '@trpc/server';
import { ActionType } from '~/constants/ActionType';
import { prisma } from '~/server/prisma';
import defaultLogger from '~/utils/logger';
import { customerProfile } from '~/server/routers/user/customerProfile';

export const integrationRouter = t.router({
  gidxCallback: t.procedure
    .input(
      yup.object({
        result: yup.mixed<GIDXDataBaseResponse>().required(),
      }),
    )
    .mutation(async ({ input }) => {
      const { result } = input;
      const logger = defaultLogger.child({ gidxResult: result });
      const { MerchantSessionID, MerchantTransactionID } = result;

      if (!MerchantSessionID) {
        logger.info(`Invalid GIDX merchant session data ${MerchantSessionID}`);
        return;
      }

      logger.info(`Begin session update ${MerchantSessionID}`);

      const session = await prisma.session.findUnique({
        where: {
          id: MerchantSessionID,
        },
      });

      if (!session) {
        logger.error(`Session not found ${MerchantSessionID}`);
        return;
      }

      logger.info(`Session ID found ${session.id}`);

      const transaction = await prisma.transaction.findUnique({
        where: {
          id: MerchantTransactionID,
        },
      });

      if (transaction) {
        logger.info(
          `TransactionID found ${transaction.id} for SessionId ${session.id}`,
        );

        const user = await prisma.user.findUnique({
          where: {
            id: session.userId,
          },
        });

        if (!user) {
          logger.error(`Invalid user.`);
          return;
        }

        try {
          const gidx = await new GIDX(
            user,
            ActionType.PAYMENT_DETAILS,
            session,
          );

          const paymentDetailResponse = await gidx.paymentDetail(
            transaction.id,
          );

          if (!paymentDetailResponse) {
            logger.error(`GIDX Payment detail not found`);
            return;
          }

          logger.info(
            `Transaction paymentDetail response ${paymentDetailResponse}`,
          );

          const transactionStatus = await prisma.transactionStatus.findFirst({
            where: {
              transactionId: transaction.id,
            },
          });

          if (transactionStatus) {
            const paymentDetail = paymentDetailResponse?.PaymentDetails[0];
            await prisma.transactionStatus.update({
              where: {
                id: transactionStatus.id,
              },
              data: {
                statusCode: Number(paymentDetail?.PaymentStatusCode),
                statusMessage: paymentDetail?.PaymentStatusMessage,
                approvalDateTime: paymentDetail?.PaymentApprovalDateTime,
                statusDateTime: paymentDetail?.PaymentStatusDateTime,
                processDateTime: paymentDetail?.PaymentProcessDateTime,
              },
            });
          }
        } catch (e: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: e.message,
          });
        }
      }
    }),
  gidxProfileNotification: t.procedure
    .input(
      yup.object({
        MerchantCustomerID: yup.string().required(),
        NotificationType: yup.string().required(),
      }),
    )
    .mutation(async ({ input }) => {
      const { MerchantCustomerID, NotificationType } = input;
      const logger = defaultLogger.child({ input });

      if (!MerchantCustomerID) {
        logger.info(`Invalid GIDX merchant customer id`);
        return;
      }
      const user = await prisma.user.findUnique({
        where: {
          id: MerchantCustomerID,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        });
      }

      switch (NotificationType) {
        case 'CustomerProfile':
          const session = await prisma.session.create({
            data: {
              userId: user.id,
              serviceType: ActionType.GET_CUSTOMER_PROFILE,
              deviceLocation: '',
              sessionRequestRaw: '',
            },
          });
          await customerProfile({
            user,
            session,
            ipAddress: '127.0.0.1',
            deviceGPS: {
              Latitude: 0,
              Longitude: 0,
            },
          });
          break;
        default:
        // Do nothing
      }
    }),
});
