/**
 * Returns the decimal odds given a set of american odds.
 * @param {number} odds american odds
 * @returns {number}
 */
export const convertToDecimalOdds = (odds: number) => {
  const stake = 100;
  const payout =
    Number(
      odds > 0
        ? Number(stake * (Math.abs(odds) / 100))
        : Number(stake / (Math.abs(odds) / 100)),
    ) + stake;
  return Number((payout / stake).toFixed(2));
};

/**
 * Calculates the payout of a parlay given the american odds.
 * @param {number[]} legs american odds of each leg of the parlay
 * @param {number} stake the total stake of the bet
 * @returns {number} The payout of the parlay.
 */
export const calculateParlayPayout = (legs: number[], stake: number) => {
  const decimalFracs = legs.map(convertToDecimalOdds);
  const totalOdds = decimalFracs.reduce(
    (acc: number, curr: number) => acc * curr,
  );
  return Number((stake * totalOdds).toFixed(2));
};

/**
 * Takes asian odds and converts them to a decimal amount rounded to the nearest integer.
 * @param {number} odds asian odds
 */
function convertToAmericanOdds(odds: number) {
  if (odds > 2) {
    return Math.round((odds - 1) * 100);
  } else {
    return Math.round(-100 / (odds - 1));
  }
}

/**
 * Calculates the total odds of a parlay given the american odds.
 * @param {number[]} legs american odds of each leg of the parlay
 * @param {"american" | "asian"} output output
 * @returns {number} The payout of the parlay.
 */
export const calculateTotalOdds = (legs: number[], output = 'asian') => {
  const decimalFracs = legs.map(convertToDecimalOdds);
  const totalOdds = decimalFracs.reduce(
    (acc: number, curr: number) => acc * curr,
  );
  const asianOdds = Number(totalOdds.toFixed(2));
  return output === 'asian' ? asianOdds : convertToAmericanOdds(asianOdds);
};
