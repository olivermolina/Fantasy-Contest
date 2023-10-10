import prisma from '~/server/prisma';
import { smsService } from '~/lib/twilio/SMSService';
import { SmsStatus } from '@prisma/client';
import logger from '~/utils/logger';
import * as z from 'zod';
import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { TOKEN } from '~/constants/TOKEN';

const sendSms = t.procedure
  .input(
    z.object({
      token: z.string().min(1, { message: 'Token is required' }),
    }),
  )
  .mutation(async ({ input }) => {
    if (input.token !== TOKEN) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    const smsLogs = await prisma.smsLog.findMany({
      where: {
        status: SmsStatus.NEW,
      },
      include: {
        User: true,
      },
    });

    for (const smsLog of smsLogs) {
      await prisma.smsLog.update({
        where: {
          id: smsLog.id,
        },
        data: {
          status: SmsStatus.PENDING,
        },
      });
      logger.info(`Sending SMS to ${smsLog.User.id}`);
      try {
        await smsService.sendMessage({
          to: smsLog.User?.phone?.toString() || '',
          body: smsLog.message,
        });
        await prisma.smsLog.update({
          where: {
            id: smsLog.id,
          },
          data: {
            status: SmsStatus.SUCCESS,
          },
        });

        logger.info(`SMS successfully sent to ${smsLog.User.id}`);
      } catch (e) {
        const error = e as Error;
        await prisma.smsLog.update({
          where: {
            id: smsLog.id,
          },
          data: {
            status: SmsStatus.FAILED,
            reason: error.message,
          },
        });
        const errMessage = `Failed to send sms to ${smsLog.User.id} | ${smsLog.User.username}. Error Message: ${error.message}`;
        logger.error(errMessage);
      }
    }

    return smsLogs;
  });

export default sendSms;
