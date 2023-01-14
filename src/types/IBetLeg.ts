import { IOffer } from './IOffer';

export interface IBetLeg {
  offer: number | IOffer;
  type:
    | 'overOdds'
    | 'underOdds'
    | 'spreadAwayOdds'
    | 'spreadHomeOdds'
    | 'moneylineAwayOdds'
    | 'moneylineHomeOdds';
  odds: number;
  /**
   * The total that needs to be O or U for this bet. Only applies when type === "underOdds" | "overOdds"
   */
  total?: number;
  /**
   * Only present when type === "spreadAwayOdds" | "spreadHomeOdds".
   */
  spread?: {
    home: number;
    away: number;
  };
}
