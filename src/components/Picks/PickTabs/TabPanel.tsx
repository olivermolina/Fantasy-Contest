import React from 'react';

interface TabPanelProps {
  value: string;
  selectedValue: string;
  children: JSX.Element | JSX.Element[];
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  if (props.value !== props.selectedValue) return null;
  return (
    <div className="flex h-full w-full z-0 bg-primary p-2 rounded-b-lg">
      {props?.children}
    </div>
  );
};

export default TabPanel;
