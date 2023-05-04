import { render, screen } from '@testing-library/react';
import PayoutAmountForm from './PayoutAmountForm';

describe('PayoutAmountForm', () => {
  it('should only show up to two digits of a users current balance', () => {
    const props = {
      setSelectedPayoutMethod: () => alert('test'),
      onSubmit: () => alert('test'),
      payoutAmount: 0,
      userTotalBalance: {
        totalCashAmount: 10.994,
        creditAmount: 11.994,
        totalAmount: 13.993,
        unPlayedAmount: 0,
        withdrawableAmount: 5.12,
      },
    };
    render(<PayoutAmountForm {...props} />);

    expect(screen.getAllByText('$10.99').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$11.99').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$13.99').length).toBeGreaterThan(0);
    expect(screen.getByText('$5.12')).toBeDefined();
  });
});
