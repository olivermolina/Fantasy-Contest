import React from 'react';
import { render } from '@testing-library/react';
import PendingPickDialog from './PendingPickDialog';
import { pendingPickDialogProps } from './__mocks__/pendingPickDialogMockProps';

describe('PendingPickDialog', () => {
  it('should render', () => {
    const { container } = render(
      <PendingPickDialog {...pendingPickDialogProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
