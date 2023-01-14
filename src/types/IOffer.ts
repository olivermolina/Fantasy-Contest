/**
 * Model definition for offers
 */
export interface IOffer {
  id: number;
  league: string;
  season?: number;
  seasonType: string;
  total?: number;
  overOdds?: number;
  underOdds?: number;
  spreadAway?: number;
  spreadHome?: number;
  spreadAwayOdds?: number;
  spreadHomeOdds?: number;
  moneylineAwayOdds?: number;
  moneylineHomeOdds?: number;
  awayScore?: number;
  homeScore?: number;
  currentPeriod?: number;
  periodTimeRemaining?: string;
  awayPeriods?: { [key: string]: any };
  homePeriods?: { [key: string]: any };
  gameId: string;
  city?: string;
  arenaName?: string;
  /**
   * Physical state location
   * @example "FL"
   */
  state?: string;
  status: 'scheduled' | 'in progress' | 'final' | 'canceled' | 'delayed';
  awayTeam: string;
  homeTeam: string;
  gameTime: string;
  raw: { [key: string]: any };
}
