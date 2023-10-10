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
  /**
   * Boolean to show admin components
   */
  isAdminView: boolean;
  /**
   * Boolean to hide tab title
   */
  showTabTitle?: boolean;
  /**
   * Boolean to hide date filters
   */
  showDateFilters?: boolean;
  /**
   * Boolean to hide balance summary
   */
  showBalanceSummary?: boolean;
}

function PickItems(props: { picks: PicksProps[]; isAdminView: boolean }) {
  const { picks, isAdminView } = props;
  if (!picks || picks.length === 0)
    return (
      <div
        className={
          'flex flex-col text-white justify-center items-center h-full'
        }
      >
        <img
          className="object-cover w-28 h-28"
          src={'/assets/images/ico_smiley_sad_w_circle.svg'}
          alt="No data available"
        />
        <span className={'text-lg font-semibold'}>No data available.</span>
        <span className={'text-sm'}>
          Visit Challenges add place some entries.
        </span>
      </div>
    );
  return (
    <>
      {picks.map(({ data, type, status }) => (
        <div key={data.id}>
          {type === BetType.STRAIGHT && (
            <StraightCard key={data.id} {...data} isAdminView={isAdminView} />
          )}
          {type === BetType.PARLAY && (
            <ParlayCard
              key={data.id}
              {...data}
              status={status}
              isAdminView={isAdminView}
            />
          )}
        </div>
      ))}
    </>
  );
}

const Picks: React.FC<PickSummaryProps> = ({
  showTabTitle = true,
  showDateFilters = true,
  showBalanceSummary = true,
  ...props
}) => {
  const tabs = [PickStatus.PENDING, PickStatus.SETTLED].map((status) => ({
    value: status,
    label: status,
    description: `${status} Picks`,
  }));
  return (
    <div className={'flex flex-col h-full w-full'}>
      {showTabTitle && (
        <Tabs
          tabs={tabs}
          activeTab={props.selectedTabStatus}
          handleChange={props.handleChangeTab}
        />
      )}
      {[PickStatus.PENDING, PickStatus.SETTLED].map((status) => (
        <TabPanel
          key={status}
          value={status}
          selectedValue={props.selectedTabStatus}
        >
          {props.isLoading ? (
            <div className="flex flex-col w-full justify-start">
              <div className={'flex gap-2'}>
                <Skeleton sx={{ height: 75, width: 65 }} />
                <Skeleton sx={{ height: 75, width: 65 }} />
                <Skeleton sx={{ height: 75, width: 65 }} />
              </div>
              <Skeleton sx={{ height: 150, width: '100%' }} />
            </div>
          ) : (
            <div className="flex flex-col w-full h-full">
              {status === PickStatus.PENDING && showBalanceSummary && (
                <PendingSummary items={props.summaryItems} />
              )}
              {status !== PickStatus.PENDING && showDateFilters && (
                <div className={'flex flex-row p-3 md:p-5 text-white'}>
                  <PickDatePickerRange
                    dateRangeValue={props.dateRangeValue}
                    setDateRangeValue={props.setDateRangeValue}
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 md:gap-4 px-1 py-3 md:px-3 h-full">
                <PickItems
                  picks={
                    props.picks.filter((pick) =>
                      status === PickStatus.SETTLED
                        ? [
                            PickStatus.LOSS,
                            PickStatus.SETTLED,
                            PickStatus.WIN,
                            PickStatus.CANCELLED,
                            PickStatus.REFUNDED,
                            PickStatus.PUSH,
                          ].includes(pick.status)
                        : pick.status === status,
                    ) || []
                  }
                  isAdminView={props.isAdminView}
                />
              </div>
            </div>
          )}
        </TabPanel>
      ))}
    </div>
  );
};

export default Picks;
