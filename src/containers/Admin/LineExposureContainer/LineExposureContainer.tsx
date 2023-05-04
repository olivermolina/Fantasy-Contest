import React, { useState } from 'react';
import BackdropLoading from '~/components/BackdropLoading';
import { trpc } from '~/utils/trpc';
import dayjs from 'dayjs';
import LineExposure from '~/components/Pages/Admin/LineExposure/LineExposure';
import { DateRangeInterface } from '~/components/Picks/PickDatePickerRange';

import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import { League } from '@prisma/client';

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

dayjs.extend(weekday);

export const LineExposureContainer = () => {
  const [selectedLeague, setSelectedLeague] = useState<League>(League.NBA);

  const [dateRangeValue, setDateRangeValue] =
    React.useState<DateRangeInterface | null>({
      startDate: dayjs(),
      endDate: dayjs(),
    });

  const { data, isLoading } = trpc.admin.getLineExposures.useQuery({
    league: selectedLeague,
    dateFrom: dayjs(dateRangeValue?.startDate).format('YYYY-MM-DD'),
    dateTo: dayjs(dateRangeValue?.endDate).format('YYYY-MM-DD'),
  });

  return (
    <>
      <BackdropLoading open={isLoading} />
      <LineExposure
        data={data || []}
        setDateRange={setDateRangeValue}
        dateRange={dateRangeValue}
        selectedLeague={selectedLeague}
        setSelectedLeague={setSelectedLeague}
      />
    </>
  );
};
