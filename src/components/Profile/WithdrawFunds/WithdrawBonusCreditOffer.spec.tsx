import { render } from '@testing-library/react';
import WithdrawBonusCreditOffer from './WithdrawBonusCreditOffer';
import { mockWithdrawBonusCreditOfferProps } from './__mocks__/mockWithdrawBonusCreditOfferProps';

describe('WithdrawBonusCreditOffer', () => {
  it('render correctly', () => {
    const { baseElement } = render(
      <WithdrawBonusCreditOffer {...mockWithdrawBonusCreditOfferProps} />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
