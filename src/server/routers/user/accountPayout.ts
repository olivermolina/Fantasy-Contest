import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import {
  PaymentMethodType,
  Session,
  Transaction,
  TransactionType,
} from '@prisma/client';
import * as yup from '~/utils/yup';
import GIDX, {
  BillingAddressInterface,
  GidxPaymentMethodInterface,
} from '~/lib/tsevo-gidx/GIDX';
import { prisma } from '~/server/prisma';
import dayjs from 'dayjs';
import { ActionType } from '~/constants/ActionType';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const accountPayout = t.procedure
  .input(
    yup.object({
      fullName: yup.string().required(),
      payoutAmount: yup.number().required(),
      billingAddress: yup.mixed<BillingAddressInterface>().required(),
      paymentMethod: yup.mixed<GidxPaymentMethodInterface>().required(),
      session: yup.mixed<Session>().required(),
      transaction: yup.mixed<Transaction>().required(),
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

    try {
      const {
        payoutAmount,
        billingAddress,
        paymentMethod,
        session,
        transaction,
        fullName,
      } = input;

      const gidx = await new GIDX(user, ActionType.PAYOUT, session);

      // Complete transaction GIDX session
      const data = await gidx.completeSession({
        fullName,
        amountProcess: payoutAmount,
        amountBonus: 0,
        transaction,
        billingAddress,
        paymentMethod,
      });

      let paymentMethodTypeDesc;
      switch (paymentMethod.type) {
        case PaymentMethodType.ACH:
          paymentMethodTypeDesc = `${data?.PaymentDetails[0]?.PaymentMethodAccount} ${data?.PaymentDetails[0]?.PaymentMethod?.AccountNumber}`;
          break;
        case PaymentMethodType.Paypal:
          paymentMethodTypeDesc = 'PAYPAL';
          break;
        default:
          paymentMethodTypeDesc = '';
      }

      await prisma.transactionStatus.create({
        data: {
          transactionId: transaction.id,
          statusCode: Number(data?.PaymentDetails[0]?.PaymentStatusCode) || 0,
          transactionType: TransactionType.DEBIT,
          transactionScore:
            data?.PaymentDetails[0]?.FinancialConfidenceScore || 0,
          transactionMethod: paymentMethodTypeDesc,
          transactionMethodType: paymentMethod.type as PaymentMethodType,
          transactionMethodAccount:
            data?.PaymentDetails[0]?.PaymentMethodAccount || '',
          approvalDateTime:
            data?.PaymentDetails[0]?.PaymentApprovalDateTime || '',
          statusDateTime: data?.PaymentDetails[0]?.PaymentStatusDateTime || '',
        },
      });

      return {
        transactionId: transaction.id,
        paymentMethod: paymentMethodTypeDesc,
        status: data?.PaymentDetails[0]?.PaymentStatusMessage || '',
        code: data?.PaymentDetails[0]?.PaymentStatusCode,
        dateTime: dayjs(
          data?.PaymentDetails[0]?.PaymentApprovalDateTime,
        ).format('MM/DD/YYYY hh:mm A'),
        depositAmount: payoutAmount,
        depositBonus: 0,
        paypalClientId: data?.Action?.ClientID,
        orderId: data?.Action?.OrderID,
      };
    } catch (e: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.ACCOUNT_TRANSACTION,
      });
    }
  });

export default accountPayout;
