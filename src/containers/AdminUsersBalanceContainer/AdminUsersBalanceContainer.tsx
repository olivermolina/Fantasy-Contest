import React from 'react';
import { trpc } from '~/utils/trpc';
import { UsersBalanceDataTable } from '~/components/Admin/UsersBalance';

const AdminUsersBalanceContainer = () => {
  const { isLoading, data, isFetching, fetchNextPage } =
    trpc.admin.usersBalance.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      },
    );

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.usersBalance) ?? [],
    [data],
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  return (
    <UsersBalanceDataTable
      flatData={flatData}
      isLoading={isLoading}
      totalDBRowCount={totalDBRowCount}
      totalFetched={totalFetched}
      isFetching={isFetching}
      fetchNextPage={fetchNextPage}
    />
  );
};

export default AdminUsersBalanceContainer;
