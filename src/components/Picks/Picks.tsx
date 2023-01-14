import React from 'react';
import { PickStatus } from '~/constants/PickStatus';
import { TabPanel, Tabs } from './PickTabs';
import PendingSummary from '~/components/Picks/PendingSummary';
import { PendingSummaryItemProps } from '~/components/Picks/PendingSummary/PendingSummary';
import { ParlayCard, StraightCard } from '~/components/Picks/PickCards';
import { StraightPickProps } from './PickCards/StraightCard';
import { ParlayCardProps } from '~/components/Picks/PickCards/ParlayCard';
import { BetType } from '@prisma/client';
import PickDatePickerRange, {
  DateRangeInterface,
} from '~/components/Picks/PickDatePickerRange';
import { Skeleton } from '@mui/material';

interface PicksProps {
  type: string;
  data: StraightPickProps | ParlayCardProps;
  status: PickStatus;
}

export interface PickSummaryProps {
  /**
   * Selected Tab Pick status
   * @example 'pending' | 'settled'
   */
  selectedTabStatus: PickStatus;
  summaryItems: PendingSummaryItemProps[];
  handleChangeTab: (value: PickStatus) => void;
  picks: PicksProps[];
  setDateRangeValue: React.Dispatch<
    React.SetStateAction<DateRangeInterface | null>
  >;
  isLoading: boolean;
  dateRangeValue: DateRangeInterface | null;
}

const renderPickItems = (picks: PicksProps[]) => {
  if (!picks || picks.length === 0) return <div>No data available.</div>;
  return picks.map(({ data, type, status }) => (
    <>
      {type === BetType.STRAIGHT && <StraightCard key={data.id} {...data} />}
      {type === BetType.PARLAY && (
        <ParlayCard key={data.id} {...data} status={status} />
      )}
    </>
  ));
};

const Picks: React.FC<PickSummaryProps> = (props) => {
  const tabs = [PickStatus.PENDING, PickStatus.SETTLED].map((status) => ({
    value: status,
    label: status,
    description: `${status} Picks`,
  }));
  return (
    <div className={'flex flex-col h-fit w-full'}>
      <Tabs
        tabs={tabs}
        activeTab={props.selectedTabStatus}
        handleChange={props.handleChangeTab}
      />
      {[PickStatus.PENDING, PickStatus.SETTLED].map((status) => (
        <TabPanel
          key={status}
          value={status}
          selectedValue={props.selectedTabStatus}
        >
          {props.isLoading ? (
            <div className="flex w-full px-5">
              <Skeleton sx={{ padding: 5, height: 100, width: '100%' }} />
            </div>
          ) : (
            <div className="flex flex-col w-full divide-y divide-gray-200 h-full">
              {status === PickStatus.PENDING ? (
                <PendingSummary items={props.summaryItems} />
              ) : (
                <div className={'flex flex-row p-3 md:p-5 '}>
                  <PickDatePickerRange
                    dateRangeValue={props.dateRangeValue}
                    setDateRangeValue={props.setDateRangeValue}
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 md:gap-4 px-1 py-3 md:px-3">
                {renderPickItems(
                  props.picks.filter((pick) =>
                    status === PickStatus.SETTLED
                      ? [
                          PickStatus.LOSS,
                          PickStatus.SETTLED,
                          PickStatus.WIN,
                          PickStatus.CANCELLED,
                        ].includes(pick.status)
                      : pick.status === status,
                  ),
                )}
              </div>
            </div>
          )}
        </TabPanel>
      ))}
    </div>
  );
};

export default Picks;
