import React, { useEffect } from 'react';
import { PickStatus } from '~/constants/PickStatus';
import Picks from '~/components/Picks';
import { trpc } from '~/utils/trpc';
import { DateRangeInterface } from '~/components/Picks/PickDatePickerRange';
import dayjs from 'dayjs';

const PicksContainer = () => {
  const [dateRangeValue, setDateRangeValue] =
    React.useState<DateRangeInterface | null>(null);

  const { data, isLoading, refetch } = trpc.bets.list.useQuery({
    startDate: dateRangeValue?.startDate,
    endDate: dateRangeValue?.endDate,
  });

  const [selectedTabStatus, setSelectedTabStatus] = React.useState<PickStatus>(
    PickStatus.PENDING,
  );
  const handleChangeTab = (newStatus: PickStatus) => {
    setSelectedTabStatus(newStatus);
    if (newStatus === PickStatus.PENDING) {
      setDateRangeValue(null);
    } else {
      setDateRangeValue({
        startDate: dayjs(new Date()).subtract(7, 'day'),
        endDate: dayjs(new Date()),
      });
    }
  };

  useEffect(() => {
    refetch();
  }, [dateRangeValue]);

  return (
    <Picks
      selectedTabStatus={selectedTabStatus}
      handleChangeTab={handleChangeTab}
      setDateRangeValue={setDateRangeValue}
      isLoading={isLoading}
      picks={data?.picks || []}
      summaryItems={data?.summaryItems || []}
      dateRangeValue={dateRangeValue}
    />
  );
};

export default PicksContainer;
