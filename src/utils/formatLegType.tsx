import { BetLegType } from '@prisma/client';
import { BetModel } from '../state/bets';

export function formatLegType(
  type: BetModel['type'],
  team: BetModel['team'],
): BetLegType {
  if (type === 'moneyline') {
    if (team === 'away') {
      return BetLegType.MONEYLINE_AWAY_ODDS;
    } else {
      return BetLegType.MONEYLINE_HOME_ODDS;
    }
  } else if (type === 'spread') {
    if (team === 'away') {
      return BetLegType.SPREAD_AWAY_ODDS;
    } else {
      return BetLegType.SPREAD_HOME_ODDS;
    }
  } else {
    if (team === 'over') {
      return BetLegType.OVER_ODDS;
    } else {
      return BetLegType.UNDER_ODDS;
    }
  }
}
