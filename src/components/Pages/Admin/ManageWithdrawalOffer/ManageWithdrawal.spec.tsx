import { render } from '@testing-library/react';
import ManageWithdrawalOffer from './ManageWithdrawalOffer';
import { mockManageWithdrawalProps } from './__mocks__/mockManageWithdrawalProps';

describe('ManageWithdrawalOffer', () => {
  it('should render correctly', () => {
    const container = render(
      <ManageWithdrawalOffer {...mockManageWithdrawalProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
