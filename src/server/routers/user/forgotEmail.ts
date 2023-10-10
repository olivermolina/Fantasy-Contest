import prisma from '~/server/prisma';
import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import z from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const forgotEmail = t.procedure
  .input(
    z.object({
      username: z.string(),
      DOB: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const dateRange = {
      gte: dayjs.utc(input.DOB).startOf('d').toDate(),
      lte: dayjs.utc(input.DOB).endOf('d').toDate(),
    };

    const prismaUser = await prisma.user.findFirst({
      where: {
        username: input.username,
        DOB: dateRange,
      },
    });

    if (!prismaUser)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: CustomErrorMessages.EMAIL_NOT_FOUND,
      });

    return prismaUser;
  });

export default forgotEmail;
