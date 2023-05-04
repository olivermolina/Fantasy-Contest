import { mockManageFreeSquarePromotionProps } from './mockManageFreeSquarePromotionProps';
import { contestCategoriesMock } from './contestCategoriesMock';

export const mockEditProps = {
  row: mockManageFreeSquarePromotionProps.data[0],
  open: true,
  handleClose: () => console.log('close'),
  contestCategories: contestCategoriesMock,
  handleSave: () => console.log('save'),
};
