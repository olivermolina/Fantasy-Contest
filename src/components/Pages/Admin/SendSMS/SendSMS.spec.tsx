import React from 'react';
import { render } from '@testing-library/react';
import SendSMS from './SendSMS';

describe('SendSMS', () => {
  it('should render', () => {
    const { container } = render(
      <SendSMS onSubmit={() => console.log('submit')} />,
    );
    expect(container).toMatchSnapshot();
  });
});
