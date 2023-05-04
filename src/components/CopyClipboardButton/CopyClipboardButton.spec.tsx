import React from 'react';
import { render } from '@testing-library/react';
import CopyClipboardButton from './CopyClipboardButton';

describe('CopyClipboardButton', () => {
  it('should render', () => {
    const { container } = render(
      <CopyClipboardButton text={'Text copied to clipboard!'} />,
    );
    expect(container).toMatchSnapshot();
  });
});
