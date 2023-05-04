import { getMarketTotalProjection } from './getMarketTotalProjection';

describe('getMarketTotalProjection', () => {
  it('should return the original market total projection if FreeSquare is null or undefined', () => {
    const totalProjection = 15;
    expect(getMarketTotalProjection(totalProjection)).toStrictEqual(
      totalProjection,
    );
    expect(getMarketTotalProjection(totalProjection, null)).toStrictEqual(
      totalProjection,
    );
  });

  it('should return the discounted total projection if FreeSquare is set', () => {
    const totalProjection = 10;
    const mockMarketFreeSquare = {
      id: '1',
      discount: 95,
    };
    expect(
      getMarketTotalProjection(totalProjection, mockMarketFreeSquare),
    ).toStrictEqual(0.5);
  });
});
