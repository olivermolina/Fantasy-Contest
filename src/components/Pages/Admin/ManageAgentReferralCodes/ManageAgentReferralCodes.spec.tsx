import { render } from '@testing-library/react';
import ManageAgentReferralCodes from './ManageAgentReferralCodes';
import { manageAgentReferralCodesMockProps } from './__mocks__/manageAgentReferralCodesMockProps';

describe('ManageAgentReferralCodes', () => {
  it('should render correctly', () => {
    const { container } = render(
      <ManageAgentReferralCodes {...manageAgentReferralCodesMockProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
