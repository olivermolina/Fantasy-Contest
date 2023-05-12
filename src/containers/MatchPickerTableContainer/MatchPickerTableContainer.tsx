import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useQueryParams } from '~/hooks/useQueryParams';
import {
  addBet,
  addToParlayBet,
  addToTeaserBet,
  BetInput,
  selectAllBets,
} from '~/state/bets';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { WarningAlert } from '~/components/Alert';
import { MatchPickRowTable } from '~/components/MatchPickRowTable/MatchPickRowTable';
import { trpc } from '~/utils/trpc';
import { BetStakeType, ContestType, League } from '@prisma/client';
import { addPlusToNumber } from '~/utils/addPlusToNumber';
import { FantasyPicker } from '~/components/FantasyPicker/FantasyPicker';
import { toast } from 'react-toastify';
import { filter, sortBy } from 'lodash';
import { Skeleton } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import type { FantasyOffer } from '~/types';
import { MATCH } from '~/server/routers/IStatNames';

const Header = (props: { isLoading: boolean }) => (
  <>
    {props.isLoading && (
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
    )}
  </>
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
  const query = trpc.contest.list.useQuery();
  const result = trpc.contest.listOffers.useQuery(
    {
      contestId: contestId,
      league: league as League,
    },
    {
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
  const contest = query.data?.find((c) => c.id === contestId);

  const categoryBgColor = useAppSelector((state) => state.ui.categoryBgColor);

  const dispatch = useAppDispatch();
  const filters =
    result?.data?.filters.map((filter) => ({
      selected: filter === contestFilter,
      onClick: () => {
        setParam('contestFilter', filter);
      },
      // no returned filters should be disabled
      disabled: false,
      children: <span className="capitalize">{filter}</span>,
      name: filter,
    })) || [];

  useEffect(() => {
    if (result?.data?.filters && league) {
      setParam('contestFilter', result?.data?.filters[0]);
    }
  }, [result?.data?.filters, league]);

  const fantasyFilteredData = useMemo(() => {
    if (result.data?.type !== ContestType.FANTASY) {
      return [];
    }
    const categoryPredicateFilter = { statName: contestFilter };
    const globalPredicateFilter = (offer: FantasyOffer) => {
      if (offer.statName === MATCH.GAME_LINE) {
        return false;
      }
      return (
        offer.playerName.includes(globalFilter) ||
        offer.playerTeam.includes(globalFilter) ||
        offer.matchName.includes(globalFilter)
      );
    };

    return sortBy(
      filter(
        result?.data?.offers,
        globalFilter ? globalPredicateFilter : categoryPredicateFilter,
      ),
      ['freeSquare', 'matchTime', 'playerTeam'],
    ) as FantasyOffer[];
  }, [globalFilter, contestFilter, result.data]);

  if (league && !result.isLoading && !result.data) {
    return <NoMatches />;
  } else if (result.data === null) {
    return (
      <>
        <Header isLoading={result.isLoading} />
        <WarningAlert>
          <>
            Sign up for a contest here or on the{' '}
            <Link href="/contests">
              <span className="underline cursor-pointer">Contest tab</span>
            </Link>{' '}
            to get started.
          </>
        </WarningAlert>
      </>
    );
  } else if (league && (result.isError || result.data?.offers?.length === 0)) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-white p-4">
        <CampaignIcon fontSize={'large'} />
        <span>COMING SOON!</span>
      </div>
    );
  } else if (
    result.data &&
    'type' in result.data &&
    result.data?.type === ContestType.MATCH
  ) {
    return (
      <>
        <Header isLoading={result.isLoading} />
        <MatchPickRowTable
          filters={filters}
          matches={sortBy(result.data.offers, [
            'freeSquare',
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
                toast.error('Select bet type.');
              }
            },
          }))}
        />
      </>
    );
  } else if (
    result.data &&
    'type' in result.data &&
    result.data?.type === ContestType.FANTASY
  ) {
    return (
      <div>
        <Header isLoading={result.isLoading} />
        <FantasyPicker
          categoryBgColor={categoryBgColor}
          filters={filters}
          cards={fantasyFilteredData.map((offer) => ({
            // TODO: [LOC-148] place fantasy pick in cart either straight bet (1 pick) or parlay if one exists
            id: offer!.id,
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
                gameId: offer!.id,
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
                gameId: offer!.id,
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
          }))}
          legs={contestBet?.legs}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
        />
      </div>
    );
  } else {
    return (
      <>
        <Header isLoading={result.isLoading} />
        {!result.isLoading && <NoMatches />}
      </>
    );
  }
};

export default MatchPickerTableContainer;
