import { render } from '@testing-library/react';
import ManageUsers from './ManageUsers';
import { manageUserMocks } from './__mocks__/manageUserMocks';

describe('ManageUsers', () => {
  it('should render correctly', () => {
    const mockProps = {
      users: manageUserMocks,
      openUserForm: jest.fn(),
      addUser: jest.fn(),
    };

    const { container } = render(<ManageUsers {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
