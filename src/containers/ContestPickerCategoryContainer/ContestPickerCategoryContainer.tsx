import React, { useEffect } from 'react';
import { trpc } from '~/utils/trpc';
import { updateAllBetsContestCategory } from '~/state/bets';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import {
  ContestCategoryWithBonusCreditLimit,
  setContestCategories,
  setSelectedContestCategory,
} from '~/state/ui';

const ContestPickerCategoryContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const contestCategory = useAppSelector(
    (state) => state.ui.selectedContestCategory,
  );
  const { data } = trpc.contest.contestCategoryList.useQuery();
  const handleChangeCategory = (
    category: ContestCategoryWithBonusCreditLimit,
  ) => {
    dispatch(setSelectedContestCategory(category));
    dispatch(updateAllBetsContestCategory(category));
  };

  useEffect(() => {
    if (data) dispatch(setContestCategories(data));
    if (!contestCategory && data) {
      handleChangeCategory(data[0] as ContestCategoryWithBonusCreditLimit);
    }
  }, [contestCategory, data]);

  return null;
};

export default ContestPickerCategoryContainer;
