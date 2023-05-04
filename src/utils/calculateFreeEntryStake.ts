/**
 * This function will calculate the user's free entry stake amount
 *
 * @param {number} creditAmount - user's available credit amount
 * @param {number} bonusCreditFreeEntryEquivalent - The value for AppSetting.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT
 * @returns {number}
 */

export const calculateFreeEntryStake = (
  creditAmount: number,
  bonusCreditFreeEntryEquivalent: number,
) => {
  if (Number(bonusCreditFreeEntryEquivalent) > creditAmount) {
    return creditAmount;
  }
  return bonusCreditFreeEntryEquivalent;
};
