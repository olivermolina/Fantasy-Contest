import prisma from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import * as z from 'zod';
import { Status } from '@prisma/client';
import dayjs from 'dayjs';
import ShortUniqueId from 'short-unique-id';

export const copyOffer = adminProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      return await prisma.$transaction(async (trx) => {
        const offer = await trx.offer.findUnique({
          where: {
            gid: input.id,
          },
          include: {
            markets: true,
          },
        });

        if (!offer) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: CustomErrorMessages.OFFER_COPY_ERROR,
          });
        }

        const uid = new ShortUniqueId({ length: 16 });
        const now = dayjs().toDate();
        const gid = uid();

        const { markets, ...otherFields } = offer;

        await trx.offer.create({
          data: {
            ...otherFields,
            gid,
            league: offer.league,
            matchup: offer.matchup,
            gamedate: dayjs.tz(now, 'America/New_York').format('YYYY-MM-DD'),
            gametime: dayjs.tz(now, 'America/New_York').format('HH:mm:ss A'),
            epoch: dayjs(now).unix(),
            created_at: now,
            updated_at: now,
            status: Status.Scheduled,
            tournamentEventId: null,
            inplay: false,
          },
        });

        await trx.market.createMany({
          data: offer.markets.map((market) => ({
            ...market,
            id: uid(),
            sel_id: dayjs().unix(),
            offerId: gid,
            created_at: now,
            updated_at: now,
            marketOverrideId: null,
          })),
        });
      });
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.TOURNAMENT_COPY_ERROR,
      });
    }
  });

export default copyOffer;
