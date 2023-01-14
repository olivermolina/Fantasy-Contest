import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';
import classNames from 'classnames';

const tabsPropTypes = {
  tabId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

const tabsContentPropTypes = {
  tabId: PropTypes.number.isRequired,
  content: PropTypes.node.isRequired,
};

export const TabPanelPropTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape(tabsPropTypes).isRequired),
  tabsContent: PropTypes.arrayOf(
    PropTypes.shape(tabsContentPropTypes).isRequired,
  ),
  variant: PropTypes.string,
};

type Props = InferPropTypes<typeof TabPanelPropTypes>;

export function TabPanel(props: Props) {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index: number) => {
    setToggleState(index);
  };
  return (
    <>
      {/* Tabs */}
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {props?.tabs?.map((tab) => {
            return (
              <li className="mr-1 lg:mr-2" key={tab?.tabId}>
                <button
                  className={classNames(
                    `${
                      toggleState === tab?.tabId
                        ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                    } inline-block p-4 rounded-t-lg border-b-2`,
                    {
                      'text-black bg-white rounded-t-lg border-transparent text-base leading-5 font-bold px-7 py-6 mr-2 lg:px-20 lg:mr-3':
                        props?.variant == 'rounded',
                    },
                  )}
                  onClick={() => toggleTab(tab?.tabId)}
                >
                  {tab?.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tab's Content Panel */}
      {props?.tabsContent?.map((tabContent) => {
        return (
          <div key={tabContent.tabId} className="content-tabs bg-white">
            <div
              className={toggleState === tabContent?.tabId ? 'block' : 'hidden'}
            >
              {tabContent.content}
            </div>
          </div>
        );
      })}
    </>
  );
}
