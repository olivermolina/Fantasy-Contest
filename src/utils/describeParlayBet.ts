import { BetLeg } from '@prisma/client';

interface ParlayBet {
  legs: BetLeg[];
}

/**
 * Given a parlay bet model with legs, this function returns a description of the bet.
 *
 * @param {ParlayBet} parlayBet - An object representing the parlay bet.
 * @returns {string} A string description of the bet.
 */
export function describeParlayBet(parlayBet: ParlayBet) {
  let description = 'This bet is a parlay with the following legs:\n';
  let totalOdds = 1;
  parlayBet.legs.forEach((leg, index) => {
    description += `${index + 1}. ${leg.marketId} (odds: ${leg.odds}, total: ${
      leg.total
    }) - ${leg.status}\n`;
    totalOdds *= +leg.odds;
  });
  description += `The total odds for this bet are ${totalOdds}.`;
  return description;
}
