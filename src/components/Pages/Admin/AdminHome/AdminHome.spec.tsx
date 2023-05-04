import React from 'react';
import { render } from '@testing-library/react';
import AdminHome from './AdminHome';
import { useRouter } from 'next/router';

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
describe('AdminHome', () => {
  it('should render', () => {
    const router = useRouter();
    const { container } = render(<AdminHome router={router} menus={[]} />);
    expect(container).toMatchSnapshot();
  });
});
