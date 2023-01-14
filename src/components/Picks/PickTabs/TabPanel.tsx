import React from 'react';

interface TabPanelProps {
  value: string;
  selectedValue: string;
  children: JSX.Element | JSX.Element[];
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  if (props.value !== props.selectedValue) return null;
  return (
    <div className="flex bg-white h-full w-full z-0 shadow-lg">
      {props?.children}
    </div>
  );
};

export default TabPanel;
