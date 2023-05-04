import { ReloadBonusType } from '~/constants/ReloadBonusType';

/**
 * This function will calculate the reload bonus based on deposit amount
 *
 * @param {number} depositAmount - the amount to be deposited
 * @param {number} reloadBonusValue - the value of AppSettings.RELOAD_BONUS_AMOUNT
 * @param {string} reloadBonusType - FLAT or PERCENTAGE
 * @returns {number}
 */

export function calculateReloadBonusAmount(
  depositAmount: number,
  reloadBonusValue: number,
  reloadBonusType: string,
): number {
  if (reloadBonusType === ReloadBonusType.FLAT) {
    return depositAmount > reloadBonusValue ? reloadBonusValue : depositAmount;
  }

  if (reloadBonusType === ReloadBonusType.PERCENTAGE) {
    return Number(depositAmount * (reloadBonusValue / 100));
  }

  return 0;
}
