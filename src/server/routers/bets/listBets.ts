import { t } from '../../trpc';
import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import {
  Bet,
  BetLeg,
  BetStakeType,
  BetStatus,
  BetType,
  ContestCategory,
  ContestWagerType,
  Market,
  Offer,
} from '@prisma/client';
import { prisma } from '~/server/prisma';
import { PickSummaryProps } from '~/components/Picks/Picks';
import dayjs, { Dayjs } from 'dayjs';
import { PickStatus } from '~/constants/PickStatus';
import { calculateInsuredPayout } from '~/utils/calculateInsuredPayout';
import {
  EntryDateFormat,
  EntryDatetimeFormat,
} from '~/constants/EntryDatetimeFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const mapBetStatusToPickStatus = (status: BetStatus) => {
  switch (status) {
    case BetStatus.LOSS:
      return PickStatus.LOSS;
    case BetStatus.WIN:
      return PickStatus.WIN;
    case BetStatus.PENDING:
      return PickStatus.PENDING;
    case BetStatus.PUSH:
      return PickStatus.SETTLED;
    case BetStatus.CANCELLED:
      return PickStatus.CANCELLED;
  }
};

const getInsuredPayout = (stake: number, contestCategory: ContestCategory) => {
  const insuredPayouts = calculateInsuredPayout(stake, contestCategory);
  return {
    numberOfPicks: contestCategory.numberOfPicks,
    ...insuredPayouts,
  };
};

export const listBets = t.procedure
  .input(
    yup.object({
      startDate: yup.mixed<Dayjs>(),
      endDate: yup.mixed<Dayjs>(),
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
    const { startDate, endDate } = input;
    const bets = await prisma.bet.findMany({
      where: {
        owner: {
          id: ctx.session.user.id,
        },
        ...(startDate &&
          endDate && {
            created_at: {
              gte: dayjs(startDate).toDate(),
              lte: dayjs(endDate).toDate(),
            },
          }),
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        legs: {
          include: {
            market: {
              include: { offer: true, player: true },
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
    });
    const mappedBets = bets.map((b) =>
      b.type === BetType.PARLAY
        ? {
            type: b.type,
            status: mapBetStatusToPickStatus(b.status),
            data: {
              id: b.id,
              name: 'Parlay Entry',
              gameInfo: b.legs.map((l) => l.market.offer?.matchup).join(', '),
              contestType:
                b?.ContestEntries?.contest?.wagerType === ContestWagerType.CASH
                  ? 'More or Less'
                  : 'Token Contest',
              pickTime: dayjs(b.created_at).format(EntryDateFormat),
              picks: b.legs.map((l) => ({
                id: l.id,
                name: l.market.name,
                description: l.market.player?.position,
                gameInfo: l.market.offer?.matchup,
                value: l.total.toNumber(),
                matchTime: dayjs(
                  `${l.market.offer?.gamedate} ${l.market.offer?.gametime} `,
                ).format(EntryDatetimeFormat),
                status: l.status,
                odd: l.type,
                category: l.market.category,
                teamAbbrev: l.market.teamAbbrev,
                team: l.market.player?.team,
                league: l.market.offer?.league,
              })),
              potentialWin:
                b.stakeType === BetStakeType.INSURED
                  ? getInsuredPayout(b.stake.toNumber(), b.ContestCategory)
                  : b.payout.toNumber(),
              risk: b.stake.toNumber(),
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
              pickTime: dayjs(b.created_at).format(EntryDateFormat),
              potentialWin:
                b.stakeType === BetStakeType.INSURED
                  ? getInsuredPayout(b.stake.toNumber(), b.ContestCategory)
                  : b.payout.toNumber(),
              risk: b.stake.toNumber(),
              status: mapBetStatusToPickStatus(b.status),
              value: b.legs[0]!.total.toNumber(),
              odd: b.legs[0]!.type,
              stakeType: b.stakeType,
              payout: b.payout.toNumber(),
              teamAbbrev: b.legs[0]!.market.teamAbbrev,
              team: b.legs[0]!.market.player?.team,
              league: b.legs[0]!.market.offer?.league,
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
