import { render, screen } from '@testing-library/react';
import FreePlayBonusCredit from './FreePlayBonusCredit';
import { ManagementInputs } from '~/components/Admin/Management/Management';

describe('FreeCredits', () => {
  const onSubmitMock = jest.fn((data: ManagementInputs) => {
    return Promise.resolve(data);
  });
  it('should render correctly', () => {
    const props = {
      onSubmit: onSubmitMock,
      users: [],
      isLoading: false,
      handleChange: () => () => alert('test'),
      expanded: 'credit',
      setSelectedUserId: jest.fn(),
    };
    const { container } = render(<FreePlayBonusCredit {...props} />);
    expect(container).toMatchSnapshot();
    expect(screen.getAllByText('Select User')).toBeDefined();
  });
});
