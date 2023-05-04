import React from 'react';
import { render } from '@testing-library/react';
import HowToPlay from './HowToPlay';

describe('HowToPlay', () => {
  it('should render correctly', () => {
    const props = {
      handleClose: () => console.log('handleClose'),
      open: false,
    };

    const { container } = render(<HowToPlay {...props} />);
    expect(container).toMatchSnapshot();
  });
});
