import { render } from '@testing-library/react';
import FreePlayUserBonusCreditsTable from './FreePlayUserBonusCreditsTable';
import { freePlayBonusCreditTableMockProps } from './__mocks__/freePlayBonusCreditTableMockProps';

describe('FreePlayUserBonusCreditsTable', () => {
  it('should render correctly', () => {
    const { container } = render(
      <FreePlayUserBonusCreditsTable {...freePlayBonusCreditTableMockProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
