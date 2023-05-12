import { render } from '@testing-library/react';
import ManagePartnersPams from './ManagePartnersPams';
import { manageUserMocks } from './__mocks__/manageUserMocks';

describe('ManagePartnersPams', () => {
  it('should render correctly', () => {
    const mockProps = {
      users: manageUserMocks,
      openUserForm: jest.fn(),
      addUser: jest.fn(),
    };

    const { container } = render(<ManagePartnersPams {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
