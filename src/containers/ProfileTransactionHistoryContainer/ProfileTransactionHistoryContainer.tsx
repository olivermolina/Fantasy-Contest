import React from 'react';
import { trpc } from '~/utils/trpc';
import TransactionHistory from '~/components/Profile/TransactionHistory';

const ProfileTransactionHistoryContainer = () => {
  const { isLoading, data } = trpc.user.transactionHistory.useInfiniteQuery(
    {
      limit: 100,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page?.transactions || []) ?? [],
    [data],
  );

  return (
    <div className="flex flex-col rounded-lg lg:py-4 my-4 lg:mx-4 bg-primary">
      <p className="font-bold text-xl p-4 hidden lg:block">
        Transaction History
      </p>
      <TransactionHistory isLoading={isLoading} flatData={flatData} />
    </div>
  );
};

export default ProfileTransactionHistoryContainer;
