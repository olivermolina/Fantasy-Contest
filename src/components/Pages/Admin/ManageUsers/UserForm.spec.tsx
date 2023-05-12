import { render } from '@testing-library/react';
import UserForm from './UserForm';
import { userMock } from './__mocks__/userMock';

describe('UserForm', () => {
  it('should render correctly', () => {
    const mockProps = {
      user: userMock,
      closeForm: jest.fn(),
      onSubmit: jest.fn(),
    };

    const { container } = render(<UserForm {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
