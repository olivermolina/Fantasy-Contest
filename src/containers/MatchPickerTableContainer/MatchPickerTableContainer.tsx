import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { useQueryParams } from '~/hooks/useQueryParams';
import {
  addBet,
  addToParlayBet,
  addToTeaserBet,
  BetInput,
  selectAllBets,
} from '~/state/bets';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { MatchPickRowTable } from '~/components/MatchPickRowTable/MatchPickRowTable';
import { trpc } from '~/utils/trpc';
import { BetStakeType, ContestType, League } from '@prisma/client';
import { addPlusToNumber } from '~/utils/addPlusToNumber';
import { FantasyPicker } from '~/components/FantasyPicker/FantasyPicker';
import { toast } from 'react-toastify';
import { filter, sortBy } from 'lodash';
import { Skeleton } from '@mui/material';
import type { FantasyOffer } from '~/types';
import { MATCH } from '~/server/routers/IStatNames';

const SkeletonLoader = () => (
  <div className={'flex flex-col p-2 gap-4'}>
    <div className={'flex flex-nowrap gap-4 py-4 p-2 '}>
      <Skeleton
        variant="rounded"
        width={100}
        height={25}
        sx={{ bgcolor: '#144e97' }}
      />
      <Skeleton
        variant="rounded"
        width={60}
        height={25}
        sx={{ bgcolor: '#144e97' }}
      />
      <Skeleton
        variant="rounded"
        width={80}
        height={25}
        sx={{ bgcolor: '#144e97' }}
      />
      <Skeleton
        variant="rounded"
        width={50}
        height={25}
        sx={{ bgcolor: '#144e97' }}
      />
    </div>
    <Skeleton
      variant="rectangular"
      width={'100%'}
      height={350}
      sx={{ bgcolor: '#144e97' }}
    />
  </div>
);

const NoMatches = () => (
  <div className="flex flex-col justify-center items-center h-full text-white p-4">
    <img
      className="object-cover w-28 h-28"
      src={'/assets/images/ico_smiley_sad_w_circle.svg'}
      alt="No data available"
    />
    <span>NO GAMES AVAILABLE</span>
  </div>
);

const MatchPickerTableContainer = () => {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const { contestFilter, setParam, league, contestId } = useQueryParams();
  const allBets = useAppSelector((state) => selectAllBets(state));
  const contestBet = useMemo(
    () => allBets.find((bet) => bet.contest === contestId),
    [allBets, contestId],
  );
  const contestList = trpc.contest.list.useQuery();
  const listOffers = trpc.contest.listOffers.useQuery(
    {
      league: league as League,
      prebuild: true,
    },
    {
      enabled: !!contestId && !!league,
      retry: false,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    },
  );

  const contestCategory = useAppSelector(
    (state) => state.ui.selectedContestCategory,
  );
  const contest = useMemo(
    () => contestList.data?.find((c) => c.id === contestId),
    [contestList.data, contestId],
  );

  const categoryBgColor = useAppSelector((state) => state.ui.categoryBgColor);

  const dispatch = useAppDispatch();
  const filters = useMemo(
    () =>
      listOffers?.data?.filters.map((filter) => ({
        selected: filter === contestFilter,
        onClick: () => {
          setParam('contestFilter', filter);
        },
        // no returned filters should be disabled
        disabled: false,
        children: <span className="capitalize">{filter}</span>,
        name: filter,
      })) || [],
    [listOffers?.data?.filters, league, contestFilter],
  );

  useEffect(() => {
    if (!league) {
      setParam('league', listOffers?.data?.league);
    }

    if (listOffers?.data?.filters) {
      setParam('contestFilter', listOffers?.data?.filters[0]);
    }
  }, [listOffers?.data, league]);

  const fantasyFilteredData = useMemo(() => {
    if (listOffers.data?.type !== ContestType.FANTASY) {
      return [];
    }
    const categoryPredicateFilter = { statName: contestFilter };
    const globalPredicateFilter = (offer: FantasyOffer) => {
      if (offer.type !== MATCH.PP) {
        return false;
      }
      const filterKey = globalFilter.toLowerCase();
      return (
        offer.playerName.toLowerCase().includes(filterKey) ||
        offer.playerTeam.toLowerCase().includes(filterKey) ||
        offer.matchName.toLowerCase().includes(filterKey)
      );
    };

    return sortBy(
      filter(
        listOffers?.data?.offers,
        globalFilter ? globalPredicateFilter : categoryPredicateFilter,
      ),
      ['freeSquare', 'matchDateTime', 'matchTime', 'playerTeam'],
    ) as FantasyOffer[];
  }, [globalFilter, contestFilter, listOffers.data]);

  if (!league || listOffers.isLoading || contestList.isLoading) {
    return <SkeletonLoader />;
  } else if (
    listOffers.data &&
    'type' in listOffers.data &&
    listOffers.data?.type === ContestType.MATCH
  ) {
    return (
      <MatchPickRowTable
        filters={filters}
        matches={sortBy(listOffers.data.offers, [
          'freeSquare',
          'matchDateTime',
          'matchTime',
          'playerTeam',
        ]).map((offer) => ({
          id: offer!.id,
          playerId: '',
          away: {
            name: offer!.away.name,
            spread: {
              disabled: false,
              value: offer!.away.spread.value,
              odds: offer!.away.spread.odds,
            },
            total: {
              disabled: false,
              value: offer!.away.total.value,
              odds: offer!.away.total.odds,
            },
            moneyline: {
              disabled: false,
              value: offer!.away.moneyline.value,
              odds: offer!.away.moneyline.odds,
            },
          },
          home: {
            name: offer!.home.name,
            spread: {
              disabled: false,
              value: offer!.home.spread.value,
              odds: offer!.home.spread.odds,
            },
            total: {
              disabled: false,
              value: offer!.home.total.value,
              odds: offer!.home.total.odds,
            },
            moneyline: {
              disabled: false,
              value: offer!.home.moneyline.value,
              odds: offer!.home.moneyline.odds,
            },
          },
          matchTime: dayjs(offer!.matchTime).format('MM/DD/YY, HH:MM'),
          onClickOffer: (
            team: 'home' | 'away',
            type: 'spread' | 'total' | 'moneyline',
          ) => {
            if (!contestId) {
              toast.error('Please select a contest to apply this entry to.');
              return;
            }
            if (!league) {
              toast.error(
                'There was an error adding this entry to the cart. Please try again later.',
              );
              return;
            }
            const contestType = contest?.type;
            if (!contestType) {
              toast.error('Unknown contest type');
              return;
            }
            if (!contestCategory) {
              toast.error('Missing contest category!');
              return;
            }
            if (!offer) {
              toast.error('Unknown offer!');
              return;
            }
            const bet: BetInput = {
              name: ContestType.MATCH,
              playerId: '',
              gameId: offer!.id,
              marketId:
                team === 'away' ? offer!.away.marketId : offer!.home.marketId,
              marketSelId:
                team === 'away'
                  ? offer!.away.marketSelId
                  : offer!.home.marketSelId,
              league: league as League,
              matchTime: offer!.matchTime,
              entity1: offer!.home.name,
              entity2: offer!.away.name,
              stake: 0,
              line: addPlusToNumber(offer[team][type].value).toString(),
              odds: offer[team][type].odds,
              type,
              team,
              teamId: '',
              contestType: contestType,
              contest: contestId,
              total: offer[team][type].value,
              contestCategory,
              statName: '',
              contestWagerType: contest.wagerType,
              stakeType: BetStakeType.INSURED,
              freeSquare: null,
            };
            if (contestFilter === 'parlay') {
              dispatch(addToParlayBet(bet));
            } else if (contestFilter === 'straight') {
              dispatch(addBet(bet));
            } else if (contestFilter === 'teaser') {
              dispatch(addToTeaserBet(bet));
            } else {
              toast.error('Select stake type.');
            }
          },
        }))}
      />
    );
  } else if (
    listOffers.data &&
    'type' in listOffers.data &&
    listOffers.data?.type === ContestType.FANTASY &&
    !!contest
  ) {
    return (
      <FantasyPicker
        categoryBgColor={categoryBgColor}
        filters={filters}
        cards={fantasyFilteredData.map((offer) => ({
          // TODO: [LOC-148] place fantasy pick in cart either straight bet (1 pick) or parlay if one exists
          id: `${offer!.id} ${offer!.freeSquare?.id || ''}`,
          onClickMore: () => {
            if (!offer) {
              toast.error('Unknown offer!');
              return;
            }
            if (!contestCategory) {
              toast.error('Missing contest category!');
              return;
            }
            const bet: BetInput = {
              playerId: offer!.playerId,
              name: offer!.playerName,
              gameId: `${offer!.id} ${offer!.freeSquare?.id || ''}`,
              marketId: offer.marketId,
              marketSelId: offer.selId,
              league: offer.league as League,
              matchTime: offer!.matchTime,
              entity1: offer.matchName.split('@')[0] || '',
              entity2: offer.matchName.split('@')[1] || '',
              stake: 0,
              line: offer.total.toString(),
              odds: offer.odds,
              type: 'total',
              team: 'over',
              teamId: offer.playerTeamId,
              contestType: ContestType.FANTASY,
              contest: contestId!,
              total: offer.total,
              contestCategory,
              statName: offer!.statName,
              contestWagerType: contest?.wagerType,
              stakeType: BetStakeType.INSURED,
              freeSquare: offer!.freeSquare,
            };
            dispatch(addToParlayBet(bet));
          },
          onClickLess: () => {
            if (!offer) {
              toast.error('Unknown offer!');
              return;
            }
            if (!contestCategory) {
              toast.error('Missing contest category!');
              return;
            }
            const bet: BetInput = {
              playerId: offer!.playerId,
              name: offer!.playerName,
              gameId: `${offer!.id} ${offer!.freeSquare?.id || ''}`,
              marketId: offer.marketId,
              marketSelId: offer.selId,
              league: offer.league as League,
              matchTime: offer!.matchTime,
              entity1: offer.matchName.split('@')[0] || '',
              entity2: offer.matchName.split('@')[1] || '',
              stake: 0,
              line: offer.total.toString(),
              odds: offer.odds,
              type: 'total',
              team: 'under',
              teamId: offer.playerTeamId,
              contestType: ContestType.FANTASY,
              contest: contestId!,
              total: offer.total,
              contestCategory,
              statName: offer!.statName,
              contestWagerType: contest?.wagerType,
              stakeType: BetStakeType.INSURED,
              freeSquare: offer!.freeSquare,
            };
            dispatch(addToParlayBet(bet));
          },
          image: offer!.playerPhotoURL,
          value: offer!.total,
          stat: offer!.statName,
          gameInfo: offer!.matchName,
          playerName: offer!.playerName,
          playerPosition: offer!.playerPosition,
          playerTeam: offer!.playerTeam,
          matchTime: offer!.matchTime,
          freeSquare: offer!.freeSquare,
          eventName: offer!.eventName,
        }))}
        legs={contestBet?.legs}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
      />
    );
  } else {
    return <NoMatches />;
  }
};

export default MatchPickerTableContainer;
