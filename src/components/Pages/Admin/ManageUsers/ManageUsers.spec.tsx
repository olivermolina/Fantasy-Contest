import { render } from '@testing-library/react';
import ManageUsers from './ManageUsers';

describe('ManageUsers', () => {
  it('should render correctly', () => {
    const mockProps = {
      users: [],
      openUserForm: jest.fn(),
      addUser: jest.fn(),
      partners: [],
    };

    const { container } = render(<ManageUsers {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
