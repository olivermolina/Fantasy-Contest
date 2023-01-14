import { faker } from '@faker-js/faker';
import React from 'react';
import { toast } from 'react-toastify';
import ContestDetailModal from '~/components/ContestDetail/ContestDetailModal';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { setActiveContestDetailModal } from '~/state/ui';
import { trpc } from '~/utils/trpc';
import { UrlPaths } from '~/constants/UrlPaths';
import { useRouter } from 'next/router';

const ContestDetailContainer = () => {
  const router = useRouter();
  const contestId = useAppSelector(
    (state) => state.ui.activeContestDetailModal,
  );
  const dispatch = useAppDispatch();
  const joinContest = trpc.contest.joinContest.useMutation();
  const result = trpc.contest.getById.useQuery({
    id: contestId || '',
  });

  if (!contestId || result.isLoading) {
    return null;
  }

  if (result.status === 'success' && result.data === null) {
    toast.error('Unable to open this contest detail.');
    return null;
  } else if (result.status === 'success' && result.data) {
    return (
      <ContestDetailModal
        {...result.data}
        // TODO: Put the rules here
        rules={{ content: faker.lorem.paragraphs() }}
        onClickJoinCompetition={async () => {
          try {
            await joinContest.mutateAsync({
              contestId: contestId,
            });
            await router.push(UrlPaths.Challenge);
            dispatch(setActiveContestDetailModal(''));
          } catch (error: any) {
            toast.error(error.shape?.message);
          }
        }}
        isModalOpen={!!contestId}
        handleClose={() => {
          dispatch(setActiveContestDetailModal(''));
        }}
        isLoading={joinContest.isLoading}
      />
    );
  } else {
    return null;
  }
};

export default ContestDetailContainer;
