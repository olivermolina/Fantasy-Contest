import { calculateFreeEntryCount } from './calculateFreeEntryCount';

describe('calculateFreeEntryCount', () => {
  it('returns 0 free entry if available user bonus credit is 0', () => {
    const bonusCredit = 0;
    const bonusCreditFreeEntryEquivalent = 25;
    expect(
      calculateFreeEntryCount(bonusCredit, bonusCreditFreeEntryEquivalent),
    ).toBe(0);
  });

  it('returns with correct free entry count if user has available bonus credit', () => {
    const bonusCredit = 65;
    const bonusCreditFreeEntryEquivalent = 25;
    expect(
      calculateFreeEntryCount(bonusCredit, bonusCreditFreeEntryEquivalent),
    ).toBe(3);
  });
});
