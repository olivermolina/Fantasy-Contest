import { BetLegType } from '@prisma/client';
import { IOffer } from '~/types';

export default function shiftLine(
  line: number,
  league: IOffer['league'],
  type: BetLegType,
): number {
  const leagueTeaserShifts: Record<IOffer['league'], number> = {
    NFL: 6,
    NCAAF: 6,
    NBA: 4,
    NCAAB: 4,
  };
  const shifter = leagueTeaserShifts[league.toUpperCase()] || 0;
  switch (type) {
    case BetLegType.SPREAD_AWAY_ODDS:
      return line + shifter;
    case BetLegType.SPREAD_HOME_ODDS:
      return line + shifter;
    case BetLegType.OVER_ODDS:
      return line + shifter;
    case BetLegType.UNDER_ODDS:
      return line - shifter;
    default:
      console.error(line, league, type);
      throw new Error('Unknown entry type.');
  }
}
