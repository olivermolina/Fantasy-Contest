import { render, screen } from '@testing-library/react';
import GetVerifiedDialog from './GetVerifiedDialog';

describe('GetVerified Dialog', () => {
  it('should show up fill out the details as shown on your license text', () => {
    const props = {
      open: true,
      handleClose: () => alert('close'),
      onSubmit: () => alert('submit'),
      isLoading: false,
    };
    render(<GetVerifiedDialog {...props} />);
    expect(
      screen.getByText('Fill out the details as shown on your license.'),
    ).toBeDefined();
  });
});
