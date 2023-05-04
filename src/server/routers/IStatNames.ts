export enum NFL_AND_NCAAF {
  RUSHING_YARDS = 'Rushing Yards',
  PASSING_YARDS = 'Passing Yards',
  RECEIVING_YARDS = 'Receiving Yards',
}

export enum NBA_AND_NCAAB {
  POINTS = 'Points',
  ASSISTS = 'Assists',
  REBOUNDS = 'Rebounds',
}

export enum MLB {
  STRIKEOUTS = 'Strikeouts',
  TOTAL_BASES = 'Total Bases',
}

export enum NHL {
  POINTS = 'Points',
  ASSISTS = 'Assists',
}

export enum MATCH {
  GAME_LINE = 'Game Line',
}

export type all = NFL_AND_NCAAF | NBA_AND_NCAAB | MLB | NHL | MATCH;
export type anyOf =
  | typeof NFL_AND_NCAAF
  | typeof NBA_AND_NCAAB
  | typeof MLB
  | typeof NHL;
