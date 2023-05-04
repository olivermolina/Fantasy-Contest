/**
 * This function will calculate cash to stake
 *
 * @param stake the amount to bet
 * @param creditAmount the free credits
 */
export function calculateCashStake(stake: number, creditAmount: number) {
  if (creditAmount > 0 && creditAmount >= stake) return 0;

  if (creditAmount > 0 && creditAmount < stake) {
    return Number(stake - creditAmount);
  }

  return stake;
}
