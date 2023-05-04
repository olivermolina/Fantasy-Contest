import { render } from '@testing-library/react';
import EditFreeSquarePromotionDialog from './EditFreeSquarePromotionDialog';
import { mockEditProps } from '~/components/Pages/Admin/ManageFreeSquarePromotion/__mocks__/mockEditProps';

describe('EditFreeSquarePromotionDialog', () => {
  it('should render correctly', () => {
    const { container } = render(
      <EditFreeSquarePromotionDialog {...mockEditProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
