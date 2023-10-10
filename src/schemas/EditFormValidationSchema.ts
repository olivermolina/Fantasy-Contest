import * as z from 'zod';
import { UserType } from '@prisma/client';

/**
 * Represents the validation schema for user form fields.
 */
export const EditFormValidationSchema = z.object({
  id: z.string().min(1, { message: 'ID is required' }),
  status: z.boolean().optional(),
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({
    message: 'Invalid email. Please enter a valid email address',
  }),
  phone: z
    .string()
    .min(8, {
      message: 'Please enter a valid phone number',
    })
    .max(14, {
      message: 'Please enter a valid phone number',
    })
    .optional(),
  type: z.nativeEnum(UserType, {
    errorMap: () => ({ message: 'Please select user type' }),
  }),
  subAdminIds: z.string().array().optional(),
  password: z.string().min(6),
  timezone: z.string().optional(),
});
