import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BalanceTableByAgent from './BalanceTableByAgent';

describe('BalanceTableByAgent', () => {
  it('should render correctly', () => {
    const props = {
      agent: null,
      globalFilter: '',
      setGlobalFilter: jest.fn(),
      data: [],
      handleSetDateFilter: jest.fn(),
      setOpen: jest.fn(),
      setUserId: jest.fn(),
      dateRange: {
        from: '2023-01-01',
        to: '2023-01-01',
      },
      setSelectedTabStatus: jest.fn(),
      setShowTabTitle: jest.fn(),
      setSelectedPlayer: jest.fn(),
    };

    const { container } = render(<BalanceTableByAgent {...props} />);
    expect(container).toMatchSnapshot();
  });
});
