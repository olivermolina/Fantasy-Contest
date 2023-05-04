import React from 'react';
import { render } from '@testing-library/react';
import AdminLayout from './AdminLayout';
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
describe('AdminLayout', () => {
  it('should render', () => {
    const router = useRouter();
    const { container } = render(<AdminLayout router={router} />);
    expect(container).toMatchSnapshot();
  });
});
