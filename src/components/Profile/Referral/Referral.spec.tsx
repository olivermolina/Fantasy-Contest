import React from 'react';
import { render } from '@testing-library/react';
import Referral from './Referral';

describe('Referral', () => {
  it('should render correctly', () => {
    const props = {
      referralCode: 'jsmith321',
      referralCustomText:
        'Refer a friend from the link or code in your profile and get $25 in bonus credit!',
    };
    const { container } = render(<Referral {...props} />);
    expect(container).toMatchSnapshot();
  });
});
