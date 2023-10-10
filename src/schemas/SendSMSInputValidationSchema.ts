import * as z from 'zod';

/**
 * Represents the validation schema for SendSMS form fields.
 */
export const SendSMSInputValidationSchema = z.object({
  textMessage: z.string().min(1, { message: 'SMS body is required' }),
  userIds: z.string().array().nonempty({
    message: 'At least one user is required',
  }),
});
