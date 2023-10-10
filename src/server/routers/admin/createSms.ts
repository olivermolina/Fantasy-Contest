import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';
import { SendSMSInputValidationSchema } from '~/schemas/SendSMSInputValidationSchema';

const createSms = adminProcedure
  .input(SendSMSInputValidationSchema)
  .mutation(async ({ input }) => {
    const users = await prisma.user.findMany({
      select: {
        phone: true,
        username: true,
        id: true,
      },
      where: {
        NOT: {
          phone: null,
        },
        id: {
          in: input.userIds,
        },
      },
    });

    return await prisma.smsLog.createMany({
      data: users.map((user) => ({
        userId: user.id,
        message: input.textMessage,
      })),
    });
  });

export default createSms;
