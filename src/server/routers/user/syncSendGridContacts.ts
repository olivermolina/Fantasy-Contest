import { t } from '../../trpc';
import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { TOKEN } from '~/constants/TOKEN';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { addSendGridContacts } from '~/lib/twilio/SendGrid';

export const syncSendGridContacts = t.procedure
  .input(
    yup
      .mixed<{
        token: string;
      }>()
      .required(),
  )
  .query(async ({ input }) => {
    if (input.token !== TOKEN) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    try {
      const users = await prisma.user.findMany();
      await addSendGridContacts(users);
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.DEFAULT,
      });
    }
  });

export default syncSendGridContacts;
