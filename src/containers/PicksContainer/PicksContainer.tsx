import React, { useEffect, useMemo } from 'react';
import { PickStatus } from '~/constants/PickStatus';
import Picks from '~/components/Picks';
import { trpc } from '~/utils/trpc';
import { DateRangeInterface } from '~/components/Picks/PickDatePickerRange';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

interface Props {
  defaultDateRange?: DateRangeInterface;
  userId?: string;
  showTabTitle?: boolean;
  showDateFilters?: boolean;
  showBalanceSummary?: boolean;
  selectedTabStatus?: PickStatus;
  /*
   * Boolean to show admin components
   */
  isAdminView: boolean;
}

const PicksContainer = (props: Props) => {
  const [dateRangeValue, setDateRangeValue] =
    React.useState<DateRangeInterface | null>(props?.defaultDateRange || null);
  const router = useRouter();
  const routerUserId = router.query?.userId;

  const startDate = useMemo(
    () => dateRangeValue?.startDate || props.defaultDateRange?.startDate,
    [dateRangeValue, props.defaultDateRange],
  );

  const endDate = useMemo(
    () => dateRangeValue?.endDate || props.defaultDateRange?.endDate,
    [dateRangeValue, props.defaultDateRange],
  );

  const { data, isLoading, refetch } = trpc.bets.list.useQuery({
    startDate: startDate?.format('YYYY-MM-DD'),
    endDate: endDate?.format('YYYY-MM-DD'),
    userId: (routerUserId as string) || props.userId,
  });

  const [selectedTabStatus, setSelectedTabStatus] = React.useState<PickStatus>(
    props.selectedTabStatus || PickStatus.PENDING,
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
      {...props}
      selectedTabStatus={selectedTabStatus}
      handleChangeTab={handleChangeTab}
      setDateRangeValue={setDateRangeValue}
      isLoading={isLoading}
      picks={data?.picks || []}
      summaryItems={data?.summaryItems || []}
      dateRangeValue={dateRangeValue}
      isAdminView={props.isAdminView}
    />
  );
};

export default PicksContainer;
