import React, { useMemo } from 'react';
import { trpc } from '~/utils/trpc';
import TableFilter from '~/components/Admin/Figures/WeeklyBalance/TableFilter';
import _ from 'lodash';
import BalanceTableByAgent from '~/components/Admin/Figures/WeeklyBalance/BalanceTableByAgent';
import {
  Dialog,
  DialogTitle,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DateRangeInterface } from '~/components/Picks/PickDatePickerRange';
import { PickStatus } from '~/constants/PickStatus';
import { DayOfWeek } from '~/constants/DayOfWeek';
import { BalanceDateRage } from '~/server/routers/admin/figures/weeklyBalances/playerWeeklyBalance';
import BalanceSummaryTable from '~/components/Admin/Figures/WeeklyBalance/BalanceSummaryTable';
import PicksContainer from '~/containers/PicksContainer/PicksContainer';
import type { IPlayerWeeklyBalance } from '~/server/routers/admin/figures/weeklyBalances/weeklyBalances';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.updateLocale('en', {
  weekStart: 1,
});

const WeeklyBalanceContainer = () => {
  const handleClose = () => {
    setOpen(false);
  };
  const [showTabTitle, setShowTabTitle] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [viewInactive, setViewInactive] = React.useState(false);
  const [includeEntryFee, setIncludeEntryFee] = React.useState(false);
  const { isLoading, data } = trpc.admin.weeklyBalances.useQuery({
    date: dayjs(date).format('YYYY-MM-DD'),
    includeInactive: viewInactive,
    includeEntryFee,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [dateRangeValue, setDateRangeValue] = React.useState<
    DateRangeInterface | undefined
  >(undefined);
  const [selectedPlayer, setSelectedPlayer] =
    React.useState<IPlayerWeeklyBalance | null>(null);
  const [selectedTabStatus, setSelectedTabStatus] = React.useState<PickStatus>(
    PickStatus.SETTLED,
  );

  const agents = useMemo(
    () =>
      _.uniqBy(
        data?.weeklyBalances?.map((player) => player.agent),
        'id',
      ),
    [data],
  );

  const handleSetDateFilter = (
    dateRange: BalanceDateRage,
    dayOfWeek?: DayOfWeek,
  ) => {
    const startDateFilter = dayjs(dateRange?.from)
      .weekday(dayOfWeek || DayOfWeek.MONDAY)
      .format('YYYY-MM-DD');
    const endDateFilter = dayjs(dateRange?.from)
      .weekday(dayOfWeek !== undefined ? dayOfWeek : DayOfWeek.SUNDAY)
      .format('YYYY-MM-DD');

    setDateRangeValue({
      startDate: dayjs(startDateFilter),
      endDate: dayjs(endDateFilter),
    });
  };

  const setIncludeEntryFeeOnClick = (includeEntryFee: boolean) => {
    setIncludeEntryFee(includeEntryFee);
  };

  return (
    <div className={'flex flex-col gap-2'}>
      <h2 className={'text-xl font-bold'}>Weekly Balance</h2>
      <TableFilter
        setDate={setDate}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        viewInactive={viewInactive}
        setViewInactive={setViewInactive}
        includeEntryFee={includeEntryFee}
        setIncludeEntryFeeOnClick={setIncludeEntryFeeOnClick}
      />
      <div className="flex flex-col justify-center items-center">
        <p>- Weekly Balance -</p>
        {isLoading ? (
          <Skeleton sx={{ width: 200 }} />
        ) : (
          <p>
            {dayjs(data?.dateRange?.from).format('MM/DD/YYYY')} to{' '}
            {dayjs(data?.dateRange?.to).format('MM/DD/YYYY')}
          </p>
        )}
      </div>
      {isLoading ? (
        <Skeleton variant={'rectangular'} sx={{ height: 200 }} />
      ) : (
        _.orderBy(agents, (agent) => agent?.id || '', ['desc']).map((agent) => (
          <BalanceTableByAgent
            key={agent?.id}
            data={
              data?.weeklyBalances.filter(
                (player) =>
                  player?.agent?.id === agent?.id &&
                  player.isActive === !viewInactive,
              ) || []
            }
            agent={agent}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            setOpen={setOpen}
            handleSetDateFilter={handleSetDateFilter}
            setSelectedPlayer={setSelectedPlayer}
            dateRange={
              data?.dateRange || { from: date.toString(), to: date.toString() }
            }
            setSelectedTabStatus={setSelectedTabStatus}
            setShowTabTitle={setShowTabTitle}
          />
        ))
      )}

      {!isLoading && (
        <BalanceSummaryTable
          data={data?.weeklyBalances || []}
          viewInactive={viewInactive}
          activeCount={data?.activeCount || 0}
          inactiveCount={data?.inactiveCount || 0}
        />
      )}

      <Dialog
        open={open}
        fullScreen
        fullWidth
        sx={{ top: 65 }}
        onClose={handleClose}
        className={'bg-secondary'}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant={'inherit'} sx={{ textAlign: 'center' }}>
            <p>{selectedPlayer?.username}</p>
            <p>
              -{' '}
              {selectedTabStatus === PickStatus.PENDING ? 'PENDING' : 'SETTLED'}{' '}
              PICKS -
            </p>
            {selectedTabStatus === PickStatus.SETTLED && (
              <p>
                {dayjs(dateRangeValue?.startDate).format('MM/DD/YYYY')} to{' '}
                {dayjs(dateRangeValue?.endDate).format('MM/DD/YYYY')}
              </p>
            )}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <div className={'bg-secondary'}>
          <PicksContainer
            userId={selectedPlayer?.id || ''}
            defaultDateRange={
              selectedTabStatus === PickStatus.SETTLED
                ? dateRangeValue
                : undefined
            }
            showBalanceSummary={false}
            showDateFilters={false}
            showTabTitle={showTabTitle}
            selectedTabStatus={selectedTabStatus}
            isAdminView
          />
        </div>
      </Dialog>
    </div>
  );
};

export default WeeklyBalanceContainer;
