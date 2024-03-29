import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import {
  Bet,
  BetLeg,
  BetStakeType,
  BetStatus,
  BetType,
  ContestWagerType,
  Market,
  Offer,
  UserType,
} from '@prisma/client';
import { prisma } from '~/server/prisma';
import { PickSummaryProps } from '~/components/Picks/Picks';
import dayjs from 'dayjs';
import { PickStatus } from '~/constants/PickStatus';
import { calculatePayout } from '~/utils/calculatePayout';
import { EntryDatetimeFormat } from '~/constants/EntryDatetimeFormat';
import { USATimeZone } from '~/constants/USATimeZone';
import { z } from 'zod';
import { formatMatchTime } from '~/utils/formatMatchTime';
import { mapLeagueLimits } from '~/server/routers/appSettings/list';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';

const mapBetStatusToPickStatus = (status: BetStatus) => {
  switch (status) {
    case BetStatus.LOSS:
      return PickStatus.LOSS;
    case BetStatus.WIN:
      return PickStatus.WIN;
    case BetStatus.PENDING:
      return PickStatus.PENDING;
    case BetStatus.PUSH:
      return PickStatus.PUSH;
    case BetStatus.CANCELLED:
      return PickStatus.CANCELLED;
    case BetStatus.REFUNDED:
      return PickStatus.CANCELLED;
  }
};

export const listBets = isAuthenticated
  .input(
    z.object({
      startDate: z.string(),
      endDate: z.string(),
      userId: z.string().optional(),
      betStatus: z.nativeEnum(PickStatus).optional(),
    }),
  )
  .output(
    yup
      .mixed<
        Omit<
          PickSummaryProps,
          | 'handleChangeTab'
          | 'selectedTabStatus'
          | 'setDateRangeValue'
          | 'isLoading'
          | 'dateRangeValue'
          | 'isAdminView'
        >
      >()
      .required(),
  )
  .query(async ({ ctx, input }) => {
    if (!ctx.session.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    const userId =
      user?.type === UserType.ADMIN && input.userId
        ? input.userId
        : ctx.session.user.id;

    const timezone = USATimeZone['America/New_York'];
    const startDate = dayjs.tz(input.startDate, timezone).toDate();
    const endDate = dayjs.tz(input.endDate, timezone).toDate();
    // Add 1 day to the end date to include all bets for the end date
    endDate.setDate(endDate.getDate() + 1);

    const updatedAtInput = {
      gte: startDate,
      lte: endDate,
    };

    const [bets, contestCategoryLeagueLimits, contestCategories] =
      await prisma.$transaction([
        prisma.bet.findMany({
          where: {
            owner: {
              id: userId,
            },
            // If betStatus is PENDING, return only pending bets without the date range filter
            ...(input.betStatus === PickStatus.PENDING
              ? {
                  status: BetStatus.PENDING,
                }
              : {
                  updated_at: updatedAtInput,
                }),
          },
          orderBy: {
            updated_at: 'desc',
          },
          include: {
            legs: {
              include: {
                market: {
                  include: {
                    offer: {
                      include: {
                        TournamentEvent: true,
                      },
                    },
                    player: true,
                  },
                },
              },
            },
            ContestEntries: {
              include: {
                contest: true,
              },
            },
            ContestCategory: true,
          },
        }),
        prisma.leagueLimit.findMany({
          include: {
            contestCategoryLeagueLimits: true,
          },
        }),
        prisma.contestCategory.findMany(),
      ]);
    const leagueLimits = mapLeagueLimits(
      contestCategoryLeagueLimits,
      contestCategories,
    );
    const mappedBets = bets.map((b) =>
      b.type === BetType.PARLAY
        ? {
            type: b.type,
            status: mapBetStatusToPickStatus(b.status),
            data: {
              id: b.id,
              name: 'Contest Entry',
              gameInfo: b.legs.map((l) => l.market.offer?.matchup).join(', '),
              contestType:
                b?.ContestEntries?.contest?.wagerType === ContestWagerType.CASH
                  ? 'More or Less'
                  : 'Token Contest',
              pickTime: dayjs(b.created_at)
                .tz(timezone)
                .format(EntryDatetimeFormat),
              settledTime: dayjs(b.updated_at)
                .tz(timezone)
                .format(EntryDatetimeFormat),
              picks: b.legs.map((l) => ({
                id: l.id,
                name: l.market.name,
                description: l.market.player?.position,
                gameInfo: l.market.offer?.matchup,
                value: l.total.toNumber(),
                matchTime: formatMatchTime(
                  l.market.offer?.gamedate,
                  l.market.offer?.gametime,
                ),
                status: l.status,
                odd: l.type,
                category: l.market.category,
                teamAbbrev: l.market.teamAbbrev,
                team: l.market.player?.team,
                league: l.market.offer?.league,
                eventName: l.market.offer?.TournamentEvent?.name || '',
              })),
              potentialWin:
                b.stakeType === BetStakeType.INSURED
                  ? calculatePayout(
                      {
                        stake: b.stake.toNumber(),
                        contestCategory: b.ContestCategory,
                        legs: b.legs.map((l) => ({
                          league: l.market!.offer!.league!,
                        })),
                      },
                      leagueLimits,
                    )
                  : b.payout.toNumber(),
              risk: b.stake.toNumber(),
              bonusCreditStake: b.bonusCreditStake.toNumber(),
              stakeType: b.stakeType,
              payout: b.payout.toNumber(),
            },
          }
        : {
            type: b.type,
            status: mapBetStatusToPickStatus(b.status),
            data: {
              id: b.id,
              name: 'Straight Bet',
              description: b.legs[0]!.market.name,
              gameInfo: b.legs[0]!.market.offer?.matchup,
              contestType: 'More or Less',
              pickTime: dayjs(b.created_at)
                .tz(timezone)
                .format(EntryDatetimeFormat),
              settledTime: dayjs(b.updated_at)
                .tz(timezone)
                .format(EntryDatetimeFormat),
              potentialWin:
                b.stakeType === BetStakeType.INSURED
                  ? calculatePayout(
                      {
                        stake: b.stake.toNumber(),
                        contestCategory: b.ContestCategory,
                        legs: b.legs.map((l) => ({
                          league: l.market!.offer!.league!,
                        })),
                      },
                      leagueLimits,
                    )
                  : b.payout.toNumber(),
              risk: b.stake.toNumber(),
              bonusCreditStake: b.bonusCreditStake.toNumber(),
              status: mapBetStatusToPickStatus(b.status),
              value: b.legs[0]!.total.toNumber(),
              odd: b.legs[0]!.type,
              stakeType: b.stakeType,
              payout: b.payout.toNumber(),
              teamAbbrev: b.legs[0]!.market.teamAbbrev,
              team: b.legs[0]!.market.player?.team,
              league: b.legs[0]!.market.offer?.league,
              eventName: b.legs[0]!.market?.offer?.TournamentEvent?.name || '',
            },
          },
    );
    const summaryItems = getSummaries(bets);
    return {
      summaryItems: summaryItems,
      picks: mappedBets,
    };
  });

function getSummaries(
  bets: (Bet & {
    legs: (BetLeg & {
      market: Market & {
        offer: Offer | null;
      };
    })[];
  })[],
) {
  return [
    {
      label: 'Entries Won',
      value: bets.reduce(
        (acc, curr) => acc + (curr.status === BetStatus.WIN ? 1 : 0),
        0,
      ),
      priority: 1,
      isShowDollarPrefix: false,
    },
    {
      label: 'Entries Lost',
      value: bets.reduce(
        (acc, curr) => acc + (curr.status === BetStatus.LOSS ? 1 : 0),
        0,
      ),
      priority: 2,
      isShowDollarPrefix: false,
    },
    {
      label: 'Total Debit Used',
      value: bets.reduce((acc, curr) => acc + curr.stake.toNumber(), 0),
      priority: 3,
      isShowDollarPrefix: true,
    },
    {
      label: 'Credit Gained',
      value: bets.reduce(
        (acc, curr) =>
          acc + (curr.status === BetStatus.WIN ? curr.payout.toNumber() : 0),
        0,
      ),
      priority: 4,
      isShowDollarPrefix: true,
    },
    {
      label: 'Debit Lost',
      value: bets.reduce(
        (acc, curr) =>
          acc + (curr.status === BetStatus.LOSS ? curr.stake.toNumber() : 0),
        0,
      ),
      priority: 5,
      isShowDollarPrefix: true,
    },
  ];
}
