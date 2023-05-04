import { render } from '@testing-library/react';
import ManageFreeSquarePromotion from './ManageFreeSquarePromotion';
import { mockManageFreeSquarePromotionProps } from './__mocks__/mockManageFreeSquarePromotionProps';

describe('ManageFreeSquarePromotion', () => {
  it('should render correctly', () => {
    const { container } = render(
      <ManageFreeSquarePromotion {...mockManageFreeSquarePromotionProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
