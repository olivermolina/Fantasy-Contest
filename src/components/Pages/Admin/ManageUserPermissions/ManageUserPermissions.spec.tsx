import { render } from '@testing-library/react';
import ManageUserPermissions from './ManageUserPermissions';
import { manageUserPermissionsMockProps } from './__mocks__/manageUserPermissionsMockProps';

describe('ManageUserPermissions', () => {
  it('should render correctly', () => {
    const { container } = render(
      <ManageUserPermissions {...manageUserPermissionsMockProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
