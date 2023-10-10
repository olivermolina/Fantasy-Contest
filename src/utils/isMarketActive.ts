/**
 * This interface will be used to define the market odds range
 */
export interface MarketOddsRangeInterface {
  MIN: number;
  MAX: number;
}

/**
 * This function will check if the market is active or not
 * based on the market odds and the market odds range settings
 * @param marketOdds - the market odds object (OVER and UNDER)
 * @param marketOddsRange - the market odds range object (MIN and MAX)
 * @returns true if the market is active, false otherwise
 */
export const isMarketActive = (
  marketOdds: {
    over: number;
    under: number;
  },
  marketOddsRange: MarketOddsRangeInterface,
) => {
  return (
    marketOdds.over! <= marketOddsRange.MAX &&
    marketOdds.over! >= marketOddsRange.MIN &&
    marketOdds.under! <= marketOddsRange.MAX &&
    marketOdds.under! >= marketOddsRange.MIN
  );
};
