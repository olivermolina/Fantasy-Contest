import { describeParlayBet } from './describeParlayBet';

describe('describeParlayBet', () => {
  it('returns the correct description for a parlay bet', () => {
    const parlayBet = {
      legs: [
        { marketId: 'Market A', odds: 1.5, total: 3, status: 'Pending' },
        { marketId: 'Market B', odds: 2, total: 5, status: 'Won' },
        { marketId: 'Market C', odds: 3, total: 10, status: 'Lost' },
      ] as any[],
    };
    const expectedResult = `This bet is a parlay with the following legs:
1. Market A (odds: 1.5, total: 3) - Pending
2. Market B (odds: 2, total: 5) - Won
3. Market C (odds: 3, total: 10) - Lost
The total odds for this bet are 9.`;

    expect(describeParlayBet(parlayBet)).toBe(expectedResult);
  });
});
