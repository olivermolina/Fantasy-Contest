import { t } from '~/server/trpc';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import sendEmail from '~/utils/sendMail';
import { TRPCError } from '@trpc/server';
import contactUsResponseEmailTemplate from '~/utils/contactUsResponseEmailTemplate';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

export interface ContactUsInput {
  name: string;
  email: string;
  phoneNumber: string;
  category: string;
  description: string;
}

const contactUs = t.procedure
  .input(yup.mixed<ContactUsInput>().required())
  .mutation(async ({ input }) => {
    try {
      const body = `
         <html>
          <h2>Contact Us</h2>
          <p>Name: ${input.name}</p>
          <p>Email: ${input.email}</p>
          <p>Phone Number: ${input.phoneNumber}</p>
          <p>Category: ${input.category}</p>
          <p>Description: ${input.description}</p>
        </html>
    `;
      const result = await sendEmail({
        emailTo: 'support@lockspread.com',
        body,
        subject: 'CUSTOMER SERVICE',
      });

      await sendEmail({
        emailTo: input.email,
        body: contactUsResponseEmailTemplate(input.name),
        subject: 'LockSpread Support',
      });

      await prisma.contactUs.create({
        data: {
          ...input,
          emailSent: result.code === 'success',
        },
      });

      return result;
    } catch (e: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.CONTACT_US,
      });
    }
  });

export default contactUs;
