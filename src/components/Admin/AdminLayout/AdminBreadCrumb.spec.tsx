import React from 'react';
import { render } from '@testing-library/react';
import AdminBreadCrumb from './AdminBreadCrumb';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    };
  },
}));
describe('AdminBreadCrumb', () => {
  it('should render', () => {
    const { container } = render(<AdminBreadCrumb />);
    expect(container).toMatchSnapshot();
  });
});
