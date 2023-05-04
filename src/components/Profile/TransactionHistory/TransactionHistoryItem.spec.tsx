import React from 'react';
import { render } from '@testing-library/react';
import TransactionHistoryItem from './TransactionHistoryItem';
import { mockTransactions } from './__mocks__/mockTransactions';

describe('TransactionHistoryItem', () => {
  it('should render correctly', () => {
    const props = {
      row: mockTransactions[1]!,
    };

    const { container } = render(<TransactionHistoryItem {...props} />);
    expect(container).toMatchSnapshot();
  });
});
