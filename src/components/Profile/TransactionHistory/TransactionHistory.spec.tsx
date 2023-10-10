import React from 'react';
import { render } from '@testing-library/react';
import TransactionHistory from './TransactionHistory';
import { mockTransactions } from './__mocks__/mockTransactions';

describe('TransactionHistory', () => {
  it('should render correctly', () => {
    const props = {
      transactions: mockTransactions,
      isLoading: false,
    };

    const { container } = render(<TransactionHistory {...props} />);
    expect(container).toMatchSnapshot();
  });
});
