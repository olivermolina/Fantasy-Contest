import React, { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { trpc } from '~/utils/trpc';
import { ContestTable } from '~/components';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { setActiveContestDetailModal } from '~/state/ui';

/**
 * This component will fetch all active contests
 */
const ContestsContainer: React.FC = () => {
  const contestModal = useAppSelector(
    (state) => state.ui.activeContestDetailModal,
  );
  const { data, isLoading, refetch } = trpc.contest.contests.useQuery();
  const dispatch = useAppDispatch();
  /**
   * Map contests to expected props or default to an empty array.
   */
  const contests = useMemo(
    () =>
      data?.map((contest) => ({
        id: contest.id,
        isActive: contest.isEnrolled,
        avatar: {
          imgSrc: contest.bgImageUrl,
          width: 200,
          height: 100,
          variant: 'rectangle',
        },
        startDate: dayjs(contest.startDate).format('MM/DD/YYYY'),
        endDate: dayjs(contest.endDate).format('MM/DD/YYYY'),
        showHeader: true,
        isJoined: contest.isEnrolled,
        entryFee: contest.entryFee,
        totalPrize: contest.totalPrize,
        entries: contest.entries,
        name: contest.name,
        leaders: contest.leaders?.map((leader) => {
          return {
            id: leader.id,
            name: leader.name,
            rank: leader.rank,
            isMe: leader.isMe,
            onClickYourself: () => alert('click me'),
          };
        }),
        onClickJoinContest: () => {
          if (!contest.isEnrolled) {
            if (contest.isJoinable) {
              dispatch(setActiveContestDetailModal(contest.id));
            } else {
              toast.warn('Contest start date past.');
            }
          }
        },
      })) || [],
    [data, dispatch],
  );
  useEffect(() => {
    refetch();
  }, [contestModal]);

  if (isLoading) return <>Loading...</>;
  if (!isLoading && contests.length == 0) {
    return (
      <div className={'flex p-5 h-screen'}>
        <p>More contests coming soon!</p>
      </div>
    );
  }
  return <ContestTable contests={contests} />;
};

export default ContestsContainer;
