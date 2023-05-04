import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AmountCellContent from './AmountCellContent';

describe('AmountCellContent', () => {
  it('should render correctly', () => {
    const props = {
      amount: 110,
      onClick: jest.fn(),
    };

    const { container } = render(<AmountCellContent {...props} />);
    expect(container).toMatchSnapshot();
  });
});
