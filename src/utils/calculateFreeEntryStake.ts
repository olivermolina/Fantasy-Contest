/**
 * This function will calculate the user's free entry stake amount
 *
 * @param {number} creditAmount -  The available credit amount.
 * @param {number} bonusCreditFreeEntryEquivalent - The equivalent amount of bonus credit for a free entry. This is the value for AppSetting.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT
 * @returns {number} The stake amount for the free entry, limited by the available credit and bonus credit equivalent.
 */

export const calculateFreeEntryStake = (
  creditAmount: number,
  bonusCreditFreeEntryEquivalent: number,
) => {
  // Determine the stake amount by choosing the minimum value among the available credit and bonus credit equivalent.
  return Math.min(bonusCreditFreeEntryEquivalent, creditAmount);
};
