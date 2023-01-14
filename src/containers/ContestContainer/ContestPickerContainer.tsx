import React, { useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { ContestPicker } from '~/components/ContestPicker/ContestPicker';
import { useQueryParams } from '~/hooks/useQueryParams';
import { setActiveContestDetailModal, setSelectedContest } from '~/state/ui';
import { trpc } from '~/utils/trpc';
import { MORE_OR_LESS_CONTEST_ID } from '~/constants/MoreOrLessContestId';
import { useAppSelector } from '~/state/hooks';

/**
 * This component will fetch all of the current users available contests and allow them to either navigate to a new contest
 * that they're already enlisted in, or open the contest detail modal for contests they're not currently involved in.
 */
const ContestPickerContainer: React.FC = () => {
  const contestModal = useAppSelector(
    (state) => state.ui.activeContestDetailModal,
  );
  const { data, isLoading, refetch } = trpc.contest.list.useQuery();
  const { setParam, contestId } = useQueryParams();
  const dispatch = useDispatch();
  /**
   * Map contests to expected props or default to an empty array.
   */
  const contests = useMemo(() => {
    if (data && !contestId) {
      const moreOrLessContest = data.find(
        (contest) => contest.id === MORE_OR_LESS_CONTEST_ID,
      );
      if (moreOrLessContest) {
        dispatch(
          setSelectedContest({
            id: moreOrLessContest.id,
            wagerType: moreOrLessContest.wagerType,
          }),
        );
        setParam('contestId', moreOrLessContest?.id);
      }
    }

    return (
      data?.map((contest) => ({
        isActive: contest.id === contestId,
        isEnrolled: contest.isEnrolled,
        bgImageUrl: contest.bgImageUrl,
        startDateString: dayjs(contest.startDate).format('MM/DD/YYYY'),
        endDateString: dayjs(contest.endDate).format('MM/DD/YYYY'),
        contestName: contest.name,
        onClickCard: () => {
          if (contest.isEnrolled) {
            setParam('contestId', contest.id);
            dispatch(
              setSelectedContest({
                id: contest.id,
                wagerType: contest.wagerType,
              }),
            );
          } else {
            // show detail modal
            if (contest.isJoinable) {
              dispatch(setActiveContestDetailModal(contest.id));
            } else {
              toast.warn('Contest start date past.');
            }
          }
        },
        showContestDates: contest.id !== MORE_OR_LESS_CONTEST_ID,
      })) || []
    );
  }, [data, dispatch, setParam, contestId]);

  useEffect(() => {
    refetch();
  }, [contestModal]);

  if (isLoading) return <>Loading...</>;

  return <ContestPicker contests={contests} />;
};

export default ContestPickerContainer;
