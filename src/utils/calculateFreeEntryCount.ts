/**
 * This function will calculate the user's free entry count
 *
 * @param {number} creditAmount - user's available credit amount
 * @param {number} bonusCreditFreeEntryEquivalent - The value for AppSetting.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT
 * @returns {number}
 */
export const calculateFreeEntryCount = (
  creditAmount: number,
  bonusCreditFreeEntryEquivalent: number,
) => {
  if (!creditAmount) return 0;

  // Decimals will be round up to the next integer i.e 1.1 = 2 entries
  return Math.ceil(creditAmount / Number(bonusCreditFreeEntryEquivalent));
};
