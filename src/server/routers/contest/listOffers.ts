import { t } from '~/server/trpc';
import {
  Contest,
  ContestType,
  League,
  MarketType,
  Status,
} from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { getFiltersByLeague } from '~/server/routers/contest/getFiltersByLeague';
import { FantasyOffer } from '~/types';
import { getFantasyOffers } from '~/server/routers/contest/getFantasyOffers';
import * as yup from '~/utils/yup';
import { uniq } from 'lodash';

const listOffers = t.procedure
  .input(
    yup.object({
      contestId: yup.string().nullable(),
      league: yup.mixed<League>().default(League.NFL),
    }),
  )
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user?.id;
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    const contest = await prisma.contest.findFirst({
      where: {
        ...(input.contestId ? { id: input.contestId } : {}),
        ContestEntries: {
          some: {
            userId,
          },
        },
      },
      include: {
        ContestEntries: {
          where: {
            userId,
          },
        },
      },
    });
    if (!contest) {
      return null;
    }

    const ContestEntry = contest.ContestEntries[0];
    if (!ContestEntry) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Missing contest entry for this user.',
      });
    }
    const contestProps: Pick<
      Contest,
      'id' | 'name' | 'startDate' | 'endDate' | 'isActive'
    > & { tokenCount: number } = {
      id: contest.id,
      name: contest.name,
      startDate: contest.startDate,
      endDate: contest.endDate,
      isActive: contest.isActive,
      tokenCount: ContestEntry.tokens.toNumber(),
    };
    if (contest.type === ContestType.MATCH) {
      const offers = (
        await prisma.offer.findMany({
          where: {
            league: input.league?.toUpperCase() as League,
            status: Status.Scheduled,
            inplay: false,
            markets: {
              some: {
                type: MarketType.GM,
              },
            },
          },
          include: {
            markets: {
              where: {
                type: MarketType.GM,
                moneyline: {
                  not: null,
                },
                spread: {
                  not: null,
                },
                total: {
                  not: null,
                },
              },
            },
            home: true,
            away: true,
          },
        })
      )
        .map((offer) => {
          const away = offer.markets.find(
            (mkt) => mkt.teamId === offer.away.id,
          );
          const home = offer.markets.find(
            (mkt) => mkt.teamId === offer.home.id,
          );
          if (!away || !home) {
            return null;
          }
          return {
            id: offer.gid,
            away: {
              name: offer.away.name,
              marketId: away.id,
              marketSelId: away.sel_id,
              spread: {
                value: away.spread || 0,
                odds: away.spread_odd || 0,
              },
              total: {
                value: away.total || 0,
                odds: away.under || 0,
              },
              moneyline: {
                value: 100,
                odds: away.moneyline || 0,
              },
            },
            home: {
              name: offer.home.name,
              marketId: home.id,
              marketSelId: home.sel_id,
              spread: {
                value: home.spread || 0,
                odds: home.spread_odd || 0,
              },
              total: {
                value: home.total || 0,
                odds: home.over || 0,
              },
              moneyline: {
                value: 100,
                odds: home.moneyline || 0,
              },
            },
            matchTime: offer.start_utc || `${offer.gamedate} ${offer.gametime}`,
          };
        })
        .filter(Boolean);
      return {
        ...contestProps,
        filters: ['straight', 'parlay', 'teaser'],
        offers: offers,
        type: ContestType.MATCH,
      };
    } else if (contest.type === ContestType.FANTASY) {
      const defaultFilters = getFiltersByLeague(input.league);
      const offers: FantasyOffer[] = await getFantasyOffers(input.league);
      const availableFilters = offers
        ?.filter((offer) => offer.type === MarketType.PP)
        .map((offer) => offer.statName);

      return {
        ...contestProps,
        filters: uniq([...defaultFilters, ...availableFilters]),
        offers: offers,
        type: ContestType.FANTASY,
      };
    } else {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Undefined contest type',
      });
    }
  });

export default listOffers;
