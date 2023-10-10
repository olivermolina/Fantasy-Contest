import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BalanceSummaryTable from './BalanceSummaryTable';

describe('BalanceSummaryTable', () => {
  it('should render correctly', () => {
    const props = {
      data: [],
      viewInactive: false,
      activeCount: 0,
      inactiveCount: 0,
    };

    const { container } = render(<BalanceSummaryTable {...props} />);
    expect(container).toMatchSnapshot();
  });
});
