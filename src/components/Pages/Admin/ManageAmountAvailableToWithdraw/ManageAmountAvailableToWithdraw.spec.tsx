import { render, screen } from '@testing-library/react';
import ManageAmountAvailableToWithdraw from './ManageAmountAvailableToWithdraw';

describe('ManageAmountAvailableToWithdraw', () => {
  it('should render correctly', () => {
    const props = {
      onSubmit: () => alert('test'),
      users: [],
      isLoading: false,
      userTotalBalance: undefined,
      setSelectedUserId: jest.fn(),
      handleChange: () => () => alert('test'),
      expanded: 'withdrawable',
    };
    const container = render(<ManageAmountAvailableToWithdraw {...props} />);
    expect(container).toMatchSnapshot();
    expect(screen.getAllByText('Select User').length).toBeDefined();
  });
});
