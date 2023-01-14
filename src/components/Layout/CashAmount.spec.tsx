import { render, screen } from '@testing-library/react';
import { CashAmount } from './CashAmount';

describe('CashAmount', () => {
  it('should only allow two decimals on the cash amount', () => {
    render(
      <CashAmount onClickAddUserCash={jest.fn()} userCashAmount={100.23333} />,
    );
    expect(screen.findByText('100.23')).toBeDefined();
  });
});
