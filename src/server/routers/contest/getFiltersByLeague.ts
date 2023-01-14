import { League } from '@prisma/client';
import * as StatNames from '~/server/routers/IStatNames';

/**
 * This function will get the mapping from league to supported stat lines
 * for fantasy picks. The idea is that these directly mimic a property in the database
 * so that this function can generically be expanded to support different stat lines.
 *
 * @param league one of the supported league enums in the application
 */
export function getFiltersByLeague(league: League): string[] {
  switch (league) {
    case League.MLB:
      return Object.values(StatNames.MLB);
    case League.NBA:
    case League.NCAAB:
      return Object.values(StatNames.NBA_AND_NCAAB);
    case League.NFL:
    case League.NCAAF:
      return Object.values(StatNames.NFL_AND_NCAAF);
    case League.NHL:
      return Object.values(StatNames.NHL);
    default:
      return [];
  }
}
