import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TableFilter from './TableFilter';

describe('TableFilter', () => {
  it('should render correctly', () => {
    const props = {
      setGlobalFilter: jest.fn(),
      setDate: jest.fn(),
      globalFilter: '',
      viewInactive: false,
      setViewInactive: jest.fn(),
    };

    const { container } = render(<TableFilter {...props} />);
    expect(container).toMatchSnapshot();
  });
});
