import { render } from '@testing-library/react';
import EditForm from './EditForm';
import { userMock } from '~/components/Pages/Admin/ManageUsers/__mocks__/userMock';

describe('EditForm', () => {
  it('should render correctly', () => {
    const mockProps = {
      user: userMock,
      subAdminUsers: [],
      closeForm: jest.fn(),
      onSubmit: jest.fn(),
    };

    const { container } = render(<EditForm {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
