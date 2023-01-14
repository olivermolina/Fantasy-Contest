import React, { useEffect } from 'react';
import { trpc } from '~/utils/trpc';
import { Skeleton, Stack } from '@mui/material';
import { ContestCategory } from '@prisma/client';
import ContestPickerCategoryCard from '~/components/ContestPickerCategory';
import { updateAllBetsContestCategory } from '~/state/bets';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { setSelectedContestCategory, setContestCategories } from '~/state/ui';

const ContestPickerCategoryContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const contestCategory = useAppSelector(
    (state) => state.ui.selectedContestCategory,
  );
  const { isLoading, data } = trpc.contest.contestCategoryList.useQuery();
  const handleChangeCategory = (category: ContestCategory) => {
    dispatch(setSelectedContestCategory(category));
    dispatch(updateAllBetsContestCategory(category));
  };

  const handleClick = (category: ContestCategory) => {
    handleChangeCategory(category);
  };

  useEffect(() => {
    if (data) dispatch(setContestCategories(data));
    if (!contestCategory && data) {
      handleChangeCategory(data[0] as ContestCategory);
    }
  }, [contestCategory, data]);

  if (isLoading) return <Skeleton />;

  if (!isLoading && !data)
    return <div> No available category for this contest</div>;

  return (
    <Stack direction={'row'} spacing={2} sx={{ mt: 1, mb: 1 }}>
      {data.map((category) => (
        <ContestPickerCategoryCard
          key={category.id}
          category={category}
          isSelected={category.id === contestCategory?.id}
          handleClick={handleClick}
        />
      ))}
    </Stack>
  );
};

export default ContestPickerCategoryContainer;
