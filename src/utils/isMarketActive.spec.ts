import { isMarketActive, MarketOddsRangeInterface } from './isMarketActive';

describe('isMarketActive', () => {
  const marketOddsRange: MarketOddsRangeInterface = {
    MIN: -150,
    MAX: 150,
  };

  it('should return true if market odds are within range', () => {
    const marketOdds = {
      over: 100,
      under: -50,
    };
    const isActive = isMarketActive(marketOdds, marketOddsRange);
    expect(isActive).toBe(true);
  });

  it('should return false if over odds are below the range', () => {
    const marketOdds = {
      over: -200,
      under: -50,
    };
    const isActive = isMarketActive(marketOdds, marketOddsRange);
    expect(isActive).toBe(false);
  });

  it('should return false if over odds are above the range', () => {
    const marketOdds = {
      over: 200,
      under: -50,
    };
    const isActive = isMarketActive(marketOdds, marketOddsRange);
    expect(isActive).toBe(false);
  });

  it('should return false if under odds are below the range', () => {
    const marketOdds = {
      over: 100,
      under: -200,
    };
    const isActive = isMarketActive(marketOdds, marketOddsRange);
    expect(isActive).toBe(false);
  });

  it('should return false if under odds are above the range', () => {
    const marketOdds = {
      over: 100,
      under: 200,
    };
    const isActive = isMarketActive(marketOdds, marketOddsRange);
    expect(isActive).toBe(false);
  });

  it('should return false if both over and under odds are below the range', () => {
    const marketOdds = {
      over: -200,
      under: -200,
    };
    const isActive = isMarketActive(marketOdds, marketOddsRange);
    expect(isActive).toBe(false);
  });

  it('should return false if both over and under odds are above the range', () => {
    const marketOdds = {
      over: 200,
      under: 200,
    };
    const isActive = isMarketActive(marketOdds, marketOddsRange);
    expect(isActive).toBe(false);
  });
});
