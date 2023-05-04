import { calculateFreeEntryStake } from './calculateFreeEntryStake';

describe('calculateFreeEntryStake', () => {
  it('returns 0 free entry stake if available user bonus credit is 0', () => {
    const bonusCredit = 0;
    const bonusCreditFreeEntryEquivalent = 25;
    expect(
      calculateFreeEntryStake(bonusCredit, bonusCreditFreeEntryEquivalent),
    ).toBe(0);
  });

  it('returns the app setting value as free entry stake if user bonus credit is more than the system setting', () => {
    const bonusCredit = 26;
    const bonusCreditFreeEntryEquivalent = 25;
    expect(
      calculateFreeEntryStake(bonusCredit, bonusCreditFreeEntryEquivalent),
    ).toBe(25);
  });

  it('returns the remaining bonus credit as free entry stake if user bonus credit is less than the app setting value', () => {
    const bonusCredit = 10;
    const bonusCreditFreeEntryEquivalent = 25;
    expect(
      calculateFreeEntryStake(bonusCredit, bonusCreditFreeEntryEquivalent),
    ).toBe(10);
  });
});
