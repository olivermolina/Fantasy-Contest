import React from 'react';
import { PickStatus } from '~/constants/PickStatus';

interface TabProps {
  value: PickStatus;
  label: string;
  description: string;
}

interface TabsProps {
  tabs: Array<TabProps>;
  activeTab: string;
  handleChange: (value: PickStatus) => void;
}

const tabConfig = {
  active:
    'flex flex-col block p-4 cursor-pointer bg-white justify-center items-center rounded-t-lg shadow-inner',
  none: 'flex flex-col p-4 cursor-pointer bg-white justify-center items-center mb-0.5 rounded-t-lg shadow-lg',
};

const Tabs = (props: TabsProps) => {
  return (
    <div className={'flex z-10 flex-row gap-4'}>
      {props.tabs.map((tab) => (
        <div
          className={`grid grid-cols bg-gradient-to-t from-gray-100 rounded-t-lg w-1/2 md:w-[300px] shadow-inner`}
          key={tab.value}
        >
          <div
            className={
              props.activeTab === tab.value ? tabConfig.active : tabConfig.none
            }
            onClick={() => props.handleChange(tab.value)}
          >
            <h5 className="text-md font-bold tracking-tight text-gray-900 uppercase">
              {tab.label}
            </h5>
            <p className="font-normal text-xs text-gray-400 capitalize">
              {tab.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
