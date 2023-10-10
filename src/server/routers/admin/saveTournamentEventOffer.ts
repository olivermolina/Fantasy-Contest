import prisma from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { TRPCError } from '@trpc/server';
import { TournamentEventOfferSchema } from '~/schemas/TournamentEventOffersSchema';
import dayjs from 'dayjs';
import { MarketResult, MarketType, Prisma, Status } from '@prisma/client';
import { Market as IMarket } from '~/lib/ev-analytics/IOddsResponse';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { reGradeMarkets } from '~/server/routers/admin/upsertOffer';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { innerFn as updateLeagueMarketCount } from '~/server/routers/contest/updateLeaguesMarketCount';
import { innerFn as updateListOffer } from '~/server/routers/contest/updateListOffers';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

export const saveTournamentEventOffer = adminProcedure
  .input(TournamentEventOfferSchema)
  .mutation(async ({ input }) => {
    try {
      const result = prisma.$transaction(
        async (trx) => {
          const tournamentEvent = await trx.tournamentEvent.findUnique({
            where: {
              id: input.tournamentEventId,
            },
          });

          if (!tournamentEvent) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: CustomErrorMessages.TOURNAMENT_EVENT_NOT_FOUND,
            });
          }

          const offerData: Prisma.OfferCreateInput = {
            gid: input.id,
            league: input.league,
            gamedate: dayjs
              .tz(input.gameDateTime, 'America/New_York')
              .format('YYYY-MM-DD'),
            gametime: dayjs
              .tz(input.gameDateTime, 'America/New_York')
              .format('HH:mm'),
            TournamentEvent: {
              connect: {
                id: input.tournamentEventId,
              },
            },
            matchup: input.matchup,
            status: input.status,
            home: {
              connect: {
                id: input.homeTeamId,
              },
            },
            away: {
              connect: {
                id: input.awayTeamId,
              },
            },
            manualEntry: true,
            epoch: dayjs(input.gameDateTime).unix(),
            inplay: input.status === Status.InProgress,
          };

          const offer = await trx.offer.upsert({
            where: {
              gid: offerData.gid,
            },
            create: offerData,
            update: offerData,
          });

          const marketData: Prisma.MarketCreateInput = {
            id: input.marketId,
            sel_id: input.sel_id,
            category: input.category,
            offer: {
              connect: {
                gid: input.id,
              },
            },
            player: {
              connect: {
                id: input.player.id,
              },
            },
            name: input.player.name,
            teamAbbrev: input.player.teamCode,
            total: input.total,
            total_stat: input.total_stat,
            active: input.active,
            type: MarketType.PP,
            offline: input.status === Status.PostponedCanceled,
            spread_result: MarketResult.Null,
            over_result: MarketResult.Null,
            under_result: MarketResult.Null,
            moneyline_result: MarketResult.Null,
            under: -100,
            over: 100,
          };

          const market = await trx.market.upsert({
            where: {
              id_sel_id: {
                id: input.marketId,
                sel_id: input.sel_id,
              },
            },
            create: marketData,
            update: marketData,
          });

          // Re-grade the markets
          if (
            offer.status === Status.Final ||
            offer.status === Status.PostponedCanceled
          ) {
            reGradeMarkets([
              {
                id: market.id,
                sel_id: market.sel_id,
                total_stat: market.total_stat,
                total: market.total,
                offline: market.offline,
              } as IMarket,
            ]);
          }

          return { offer, market };
        },

        {
          maxWait: 10000, // default: 2000
          timeout: 10000, // default: 5000
        },
      );

      await Promise.all([
        updateLeagueMarketCount(input.league),
        updateListOffer(input.league),
      ]);

      return result;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.TOURNAMENT_SAVE_ERROR,
      });
    }
  });
