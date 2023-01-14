import React, { useMemo, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { LeaderBoardTable } from '~/components';

/**
 * This component will fetch all of leaders from active contests
 */
const LeaderboardContainer: React.FC = () => {
  const [contestId, setContestId] = useState('');
  const contests = trpc.contest.contests.useQuery();
  const { data, isLoading, refetch } = trpc.contest.leaders.useQuery({
    contestId: contestId,
  });
  /**
   * Map leaders to expected props or default to an empty array.
   */
  const leaders = useMemo(
    () =>
      data?.map((leader) => ({
        id: leader.id,
        avatar: {
          imgSrc: leader.bgImageUrl,
          height: 30,
          width: 30,
        },
        isTopRanked: leader.isTopRanked,
        name: leader.name,
        points: leader.points,
        rank: leader.rank,
        showHeader: true,
      })) || [],
    [data],
  );
  const firstContest = contests?.data?.find((element) => element !== undefined);
  if (firstContest && contestId == '') {
    setContestId(firstContest.id);
  }
  const contestsData = useMemo(
    () =>
      contests?.data?.map((contest) => {
        return {
          id: contest.id,
          name: contest.name,
        };
      }) || [],
    [contests],
  );
  if (isLoading || contests.isLoading) return <>Loading...</>;
  return (
    <LeaderBoardTable
      contests={contestsData.map((contest) => {
        return {
          selected: contestId == contest.id,
          onClick: () => {
            setContestId(contest.id);
            refetch;
          },
          // no returned filters should be disabled
          disabled: false,
          children: <span className="capitalize text-xs">{contest.name}</span>,
          name: contest.name,
        };
      })}
      leaders={leaders}
    />
  );
};

export default LeaderboardContainer;
