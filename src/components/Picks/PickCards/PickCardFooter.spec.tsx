import React from 'react';
import { render, screen } from '@testing-library/react';
import PickCardFooter from './PickCardFooter';
import { PickStatus } from '~/constants/PickStatus';
import { BetStakeType } from '@prisma/client';

describe('PickCardFooter', () => {
  it('should render', () => {
    const props = {
      risk: 10,
      status: PickStatus.PENDING,
      potentialWin: 100,
      stakeType: BetStakeType.ALL_IN,
      payout: 100,
      bonusCreditStake: 10,
    };
    const { container } = render(<PickCardFooter {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('should not show bonus credit column if it is not admin view', () => {
    const props = {
      risk: 10,
      status: PickStatus.PENDING,
      potentialWin: 100,
      stakeType: BetStakeType.ALL_IN,
      payout: 100,
      bonusCreditStake: 10,
      isAdminView: false,
    };
    render(<PickCardFooter {...props} />);

    expect(screen.queryAllByText('Bonus Credit')).toHaveLength(0);
  });

  it('should show bonus credit column if it is admin view', () => {
    const props = {
      risk: 10,
      status: PickStatus.PENDING,
      potentialWin: 100,
      stakeType: BetStakeType.ALL_IN,
      payout: 100,
      bonusCreditStake: 10,
      isAdminView: true,
    };
    render(<PickCardFooter {...props} />);

    expect(screen.queryAllByText('Bonus Credit')).toHaveLength(1);
  });
});
