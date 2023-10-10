import { render } from '@testing-library/react';
import ManageAmountAvailableToWithdraw from './ManageAmountAvailableToWithdraw';

describe('ManageAmountAvailableToWithdraw', () => {
  it('should render correctly', () => {
    const props = {
      users: [],
      isLoading: false,
      saveUserWallet: () => () => alert('test'),
    };
    const container = render(<ManageAmountAvailableToWithdraw {...props} />);
    expect(container).toMatchSnapshot();
  });
});
