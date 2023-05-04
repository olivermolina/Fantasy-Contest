import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DepositAmount from './DepositAmount';
import { mockDepositAmountProps } from './__mocks__/mockDepositAmountProps';

describe('DepositAmount', () => {
  it('should render correctly', () => {
    const { container } = render(<DepositAmount {...mockDepositAmountProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should not render first deposit match INSTANT Bonus or Reload Bonus ', () => {
    render(<DepositAmount {...mockDepositAmountProps} />);

    expect(screen.queryAllByText('INSTANT Bonus')).toHaveLength(0);
    expect(screen.queryAllByText('Reload Bonus')).toHaveLength(0);
  });

  it('should render first deposit match INSTANT Bonus', () => {
    render(<DepositAmount {...mockDepositAmountProps} isFirstDeposit={true} />);

    expect(screen.queryAllByText('INSTANT Bonus')).toHaveLength(6);
  });

  it('should render Reload Bonus text when AppSetting.RELOAD_BONUS_AMOUNT is greater than 0', () => {
    render(
      <DepositAmount {...mockDepositAmountProps} reloadBonusAmount={50} />,
    );

    expect(screen.queryAllByText('Reload Bonus')).toHaveLength(6);
  });
});
