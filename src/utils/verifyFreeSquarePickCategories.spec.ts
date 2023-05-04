import { verifyFreeSquarePickCategories } from '~/utils/verifyFreeSquarePickCategories';
import { freeSquareMocks } from '~/utils/__mocks__/freeSquareMocks';

describe('verifyFreeSquarePickCategories', () => {
  it('should not throw an error if Free Square is not enabled', () => {
    expect(() => verifyFreeSquarePickCategories(2, null)).not.toThrow(Error);
  });

  it('should not throw an error if Free Square is enabled but # of picks category is not set', () => {
    expect(() =>
      verifyFreeSquarePickCategories(2, {
        ...freeSquareMocks,
        FreeSquareContestCategory: null,
      }),
    ).not.toThrow(Error);
  });

  it('should throw an error if Free Square is enabled and the total number of entries is not found in the # of picks category ', async () => {
    await expect(async () =>
      verifyFreeSquarePickCategories(3, freeSquareMocks),
    ).rejects.toThrow(Error);
  });

  it('should not throw an error if Free Square is enabled and the total number of entries is found in the # of picks category ', async () => {
    await expect(async () =>
      verifyFreeSquarePickCategories(4, freeSquareMocks),
    ).not.toThrow(Error);
  });
});
