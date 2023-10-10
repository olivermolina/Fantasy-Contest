import React from 'react';
import { trpc } from '~/utils/trpc';
import { ThemeProvider } from '@mui/material/styles';
import TransactionHistory from '~/components/Profile/TransactionHistory';
import PickDatePickerRange from '~/components/Picks/PickDatePickerRange';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { theme } from '~/components';

interface Props {
  userId?: string;
}

const ProfileTransactionHistoryContainer = (props: Props) => {
  const router = useRouter();
  const from = dayjs((router.query.from as string) ?? dayjs().startOf('M'));
  const to = dayjs((router.query.to as string) ?? dayjs().endOf('M'));

  const { isLoading, data } = trpc.user.transactionHistory.useQuery(
    {
      userId: props.userId,
      from: from.toISOString(),
      to: to.toISOString(),
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div className="flex flex-col rounded-lg lg:py-4 my-4 lg:mx-4 bg-primary text-white">
      <p className="font-bold text-xl p-4 hidden lg:block">
        Transaction History
      </p>

      <hr className="border-slate-500" />

      <div className={'p-2'}>
        <ThemeProvider theme={theme}>
          <PickDatePickerRange
            setDateRangeValue={({ startDate, endDate }) => {
              router.push({
                query: {
                  from: startDate.startOf('D').toISOString(),
                  to: endDate.startOf('D').toISOString(),
                  userId: props.userId,
                },
              });
            }}
            dateRangeValue={{
              startDate: dayjs(from),
              endDate: dayjs(to),
            }}
          />
        </ThemeProvider>
      </div>

      <TransactionHistory isLoading={isLoading} transactions={data || []} />
    </div>
  );
};

export default ProfileTransactionHistoryContainer;
