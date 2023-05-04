import * as yup from '~/utils/yup';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';
import { smsService } from '~/lib/twilio/SMSService';

const sendSms = adminProcedure
  .input(
    yup.object({
      textMessage: yup.string().required(),
    }),
  )
  .mutation(async ({ input }) => {
    const users = await prisma.user.findMany({
      select: {
        phone: true,
      },
      where: {
        NOT: {
          phone: null,
        },
      },
    });

    users.forEach((user) => {
      smsService.sendMessage({
        to: user?.phone?.toString() || '',
        body: input.textMessage,
      });
    });

    return 'Success!';
  });

export default sendSms;
