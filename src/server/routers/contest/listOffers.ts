import {
  Contest,
  ContestType,
  ContestWagerType,
  League,
  MarketType,
  Status,
} from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { FantasyOffer } from '~/types';
import { getFantasyOffers } from '~/server/routers/contest/getFantasyOffers';
import { uniq } from 'lodash';
import z from 'zod';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';

const listOffers = isAuthenticated
  .input(
    z.object({
      contestId: z.string().nullable().optional(),
      league: z.nativeEnum(League).default(League.NFL),
      includeInActive: z.boolean().optional(),
      oddsRange: z
        .object({
          min: z.number().default(-200),
          max: z.number().default(200),
        })
        .optional(),
      prebuild: z.boolean().optional(),
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
        ...(input.contestId
          ? { id: input.contestId }
          : { wagerType: ContestWagerType.CASH }),
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
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.CONTEST_NOT_FOUND,
      });
    }

    const ContestEntry = contest.ContestEntries[0];
    if (!ContestEntry) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.CONTEST_ENTRY_MISSING,
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
        league: input.league?.toUpperCase() as League,
      };
    } else if (contest.type === ContestType.FANTASY) {
      let offers: FantasyOffer[] = [];

      if (input.prebuild) {
        const prebuildListOffers = await prisma.listOffer.findFirst({
          where: {
            league: input.league?.toUpperCase() as League,
          },
        });
        if (
          prebuildListOffers?.jsonData &&
          typeof prebuildListOffers?.jsonData === 'object' &&
          Array.isArray(prebuildListOffers?.jsonData)
        ) {
          offers = prebuildListOffers.jsonData as unknown as FantasyOffer[];
        }
      }

      if (offers.length === 0) {
        offers = await getFantasyOffers(
          input.league,
          input.includeInActive,
          input.oddsRange,
        );
      }

      const filters = offers
        ?.filter((offer) => offer.type === MarketType.PP)
        .map((offer) => offer.statName);
      const marketCategories = await prisma.marketCategory.findMany({
        where: {
          league: input.league?.toUpperCase() as League,
          category: {
            in: filters,
          },
        },
        orderBy: {
          order: 'asc',
        },
      });

      return {
        ...contestProps,
        filters: uniq([
          ...marketCategories.map((cat) => cat.category),
          ...filters,
        ]),
        offers: offers,
        type: ContestType.FANTASY,
        league: input.league?.toUpperCase() as League,
      };
    } else {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.CONTEST_NOT_FOUND,
      });
    }
  });

export default listOffers;
