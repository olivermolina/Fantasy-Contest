import { calculateBonusCreditStake } from './calculateBonusCreditStake';

describe('calculateBonusCreditStake', () => {
  it('returns 0 bonus credit stake amount  if available play free bonus credit is 0', () => {
    const stake = 100;
    const bonusCreditRemaining = 0;
    expect(calculateBonusCreditStake(stake, bonusCreditRemaining)).toBe(0);
  });

  it('returns bonus credit remaining as the bonus credit stake amount if available play free bonus credit is less than the stake amount ', () => {
    const stake = 100;
    const bonusCreditRemaining = 10;
    expect(calculateBonusCreditStake(stake, 10)).toBe(bonusCreditRemaining);
  });

  it('returns stake amount as bonus credit stake amount if available play free bonus credit is greater than or equal the stake amount ', () => {
    const stake = 100;
    const bonusCreditRemaining1 = 500;
    expect(calculateBonusCreditStake(stake, bonusCreditRemaining1)).toBe(stake);

    const bonusCreditRemaining2 = 100;
    expect(calculateBonusCreditStake(stake, bonusCreditRemaining2)).toBe(stake);
  });
});
