import * as z from 'zod';
import { League } from '@prisma/client';

/**
 * Represents the validation schema for TournamentEvent form fields.
 */
export const TournamentEventSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Event name is required' }),
  updated_at: z.date({
    required_error: 'Please select a date and time',
    invalid_type_error: "That's not a date!",
  }),
  league: z.nativeEnum(League),
});

/**
 * Defines the form fields for TournamentEvent form.
 */
export type TournamentEventInput = z.infer<typeof TournamentEventSchema>;
