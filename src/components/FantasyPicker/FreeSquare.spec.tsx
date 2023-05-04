import React from 'react';
import { render } from '@testing-library/react';
import FreeSquare from './FreeSquare';

describe('FreeSquare', () => {
  it('should render correctly', () => {
    const props = {
      gameDateTime: '2023-03-25 8:00 PM',
      discount: 95,
    };
    const { container } = render(<FreeSquare {...props} />);
    expect(container).toMatchSnapshot();
  });
});
