import React from 'react';
import { render } from '@testing-library/react';
import { PendingBetsManagement } from './PendingBetsManagement';
import { mockProps } from './__mocks__/mockProps';

describe('PendingBetsManagement', () => {
  it('should render', () => {
    const { container } = render(<PendingBetsManagement {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
