/**
 * This function will calculate bonus credit to stake
 *
 * @param {number} stake - entry stake amount
 * @param {number} bonusCreditRemaining - remaining free credits
 * @returns {number}
 */
export function calculateBonusCreditStake(
  stake: number,
  bonusCreditRemaining: number,
) {
  if (bonusCreditRemaining === 0) return 0;

  if (bonusCreditRemaining >= stake) return stake;

  return bonusCreditRemaining;
}
