import { render } from '@testing-library/react';
import UserForm from './UserForm';
import {
  manageUserMocks,
  subAdminUsersMock,
} from './__mocks__/manageUserMocks';

describe('UserForm', () => {
  it('should render correctly', () => {
    const mockProps = {
      user: manageUserMocks[0]!,
      subAdminUsers: subAdminUsersMock,
      closeForm: jest.fn(),
      onSubmit: jest.fn(),
    };

    const { container } = render(<UserForm {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
