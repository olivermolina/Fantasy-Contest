import { calculateReloadBonusAmount } from './calculateReloadBonusAmount';
import { ReloadBonusType } from '~/constants/ReloadBonusType';

describe('calculateReloadBonusAmount', () => {
  it('returns the correct reload bonus amount if FLAT type', () => {
    const depositAmount = 100;
    const reloadBonusValue = 50;
    const reloadBonusType = ReloadBonusType.FLAT;
    expect(
      calculateReloadBonusAmount(
        depositAmount,
        reloadBonusValue,
        reloadBonusType,
      ),
    ).toBe(50);
  });

  it('returns the correct reload bonus amount if PERCENTAGE type', () => {
    const depositAmount = 50;
    const reloadBonusValue = 10;
    const reloadBonusType = ReloadBonusType.PERCENTAGE;
    expect(
      calculateReloadBonusAmount(
        depositAmount,
        reloadBonusValue,
        reloadBonusType,
      ),
    ).toBe(5);
  });
});
