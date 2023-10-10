import prisma from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import * as z from 'zod';
import { Status } from '@prisma/client';
import dayjs from 'dayjs';
import ShortUniqueId from 'short-unique-id';

export const copyTournamentEvent = adminProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      return await prisma.$transaction(async (trx) => {
        const tournamentEvent = await trx.tournamentEvent.findUnique({
          where: {
            id: input.id,
          },
          include: {
            Offers: {
              include: {
                markets: true,
              },
            },
          },
        });

        if (!tournamentEvent) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: CustomErrorMessages.TOURNAMENT_COPY_ERROR,
          });
        }

        const newTournamentEvent = await trx.tournamentEvent.create({
          data: {
            name: `${tournamentEvent.name} (Copy)`,
            league: tournamentEvent.league,
          },
        });

        const uid = new ShortUniqueId({ length: 16 });
        const now = dayjs().toDate();

        const newOffers = [];
        const newMarkets = [];

        for (const offer of tournamentEvent.Offers) {
          const gid = uid();
          const { markets, ...otherFields } = offer;
          newOffers.push({
            ...otherFields,
            gid,
            league: offer.league,
            matchup: offer.matchup,
            gamedate: dayjs.tz(now, 'America/New_York').format('YYYY-MM-DD'),
            gametime: dayjs.tz(now, 'America/New_York').format('HH:mm'),
            epoch: dayjs(now).unix(),
            created_at: now,
            updated_at: now,
            status: Status.Scheduled,
            tournamentEventId: newTournamentEvent.id,
            inplay: false,
          });
          const marketData = offer.markets.map((market) => ({
            ...market,
            id: uid(),
            sel_id: dayjs().unix(),
            offerId: gid,
            created_at: now,
            updated_at: now,
            marketOverrideId: null,
          }));

          newMarkets.push(...marketData);
        }

        await trx.offer.createMany({
          data: newOffers,
        });

        await trx.market.createMany({
          data: newMarkets,
        });
      });
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.TOURNAMENT_COPY_ERROR,
      });
    }
  });

export default copyTournamentEvent;
