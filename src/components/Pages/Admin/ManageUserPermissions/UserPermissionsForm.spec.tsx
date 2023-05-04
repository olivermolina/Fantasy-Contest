import { render } from '@testing-library/react';
import UserPermissionsForm from './UserPermissionsForm';
import { userPermissionsFormMockProps } from './__mocks__/userPermissionsFormMockProps';

describe('UserPermissionsForm', () => {
  it('should render correctly', () => {
    const { container } = render(
      <UserPermissionsForm {...userPermissionsFormMockProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
