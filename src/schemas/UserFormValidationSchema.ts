import * as z from 'zod';
import { UserStatus } from '@prisma/client';

/**
 * Represents the validation schema for user form fields.
 */
export const UserFormValidationSchema = z.object({
  id: z.string().min(1, { message: 'ID is required' }),
  status: z.nativeEnum(UserStatus, {
    errorMap: () => ({ message: 'Please select user status' }),
  }),
  username: z.string().min(1, { message: 'Username is required' }),
  firstname: z.string().min(1, { message: 'First name is required' }),
  lastname: z.string().min(1, { message: 'Last name is required' }),
  address1: z.string().min(1, { message: 'Address 1 is required' }),
  address2: z.string().optional(),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postalCode: z.string().optional(),
  DOB: z.date({
    required_error: 'DOB is required',
    invalid_type_error: "That's not a DOB!",
  }),
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
  password: z.string().min(6),
});
