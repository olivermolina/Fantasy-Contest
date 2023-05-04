import { render } from '@testing-library/react';
import BonusCreditLimits from './BonusCreditLimits';
import { bonusCreditLimitMockProps } from '~/components/Pages/Admin/BonusCreditLimits/__mocks__/bonusCreditLimitMockProps';

describe('BonusCreditLimits', () => {
  it('should render correctly', () => {
    const { container } = render(
      <BonusCreditLimits {...bonusCreditLimitMockProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
