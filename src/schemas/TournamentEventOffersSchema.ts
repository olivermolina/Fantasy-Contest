import * as z from 'zod';
import { League, Status } from '@prisma/client';

/**
 * Represents the validation schema for TournamentEventOffer form fields.
 */
export const TournamentEventOfferSchema = z.object({
  id: z.string(), // offer.gid
  tournamentEventId: z.string(),
  marketId: z.string(),
  sel_id: z.number(),
  league: z.nativeEnum(League),
  status: z.nativeEnum(Status),
  matchup: z.string(),
  gameDateTime: z.date({
    required_error: 'Please select a game datetime',
    invalid_type_error: "That's not a game datetime!",
  }),
  category: z.string(),
  player: z.object({
    id: z.string(),
    name: z.string(),
    teamId: z.string(),
    teamCode: z.string(),
  }),
  total: z.coerce.number(),
  total_stat: z.coerce.number().optional(),
  active: z.boolean(),
  awayTeamId: z.string(),
  homeTeamId: z.string(),
});

/**
 * Defines the form fields for TournamentEventOffers form.
 */
export type TournamentEventOfferInput = z.infer<
  typeof TournamentEventOfferSchema
>;
