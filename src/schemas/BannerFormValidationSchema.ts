import * as z from 'zod';

/**
 * Represents the validation schema for user form fields.
 */
export const BannerFormValidationSchema = z.object({
  id: z.string().min(1, { message: 'ID is required' }),
  text: z.string().min(1, { message: 'Text is required' }),
  priority: z.coerce.number().min(1, { message: 'Priority is required' }),
  appSettingId: z.string().optional().nullable(),
});
