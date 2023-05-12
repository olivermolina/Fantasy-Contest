import { render } from '@testing-library/react';
import EditForm from './EditForm';
import {
  manageUserMocks,
  subAdminUsersMock,
} from './__mocks__/manageUserMocks';

describe('EditForm', () => {
  it('should render correctly', () => {
    const mockProps = {
      user: manageUserMocks[0]!,
      subAdminUsers: subAdminUsersMock,
      closeForm: jest.fn(),
      onSubmit: jest.fn(),
    };

    const { container } = render(<EditForm {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
