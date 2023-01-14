export enum NFL_AND_NCAAF {
  RUSHING_YARDS = 'Rushing Yards',
  PASSING_YARDS = 'Passing Yards',
  RECEIVING_YARDS = 'Receiving Yards',
  RECEPTIONS = 'Receptions',
  PASS_TD_S = "Pass TD's",
  RUSH_TD_S = "Rush TD's",
  REC_TD_S = "Rec TD's",
}

export enum NBA_AND_NCAAB {
  POINTS = 'Points',
  ASSISTS = 'Assists',
  REBOUNDS = 'Rebounds',
}

export enum MLB {
  STRIKEOUTS = 'Strikeouts',
  TOTAL_BASES = 'Total Bases',
  TOTAL_HITS = 'Total Hits',
  HOME_RUNS = 'HomeRuns',
}

export enum NHL {
  SHOTS_ON_GOAL = 'Shots On Goal',
  GOALS_ALLOWED = 'Goals Allowed',
  HITS = 'Hits',
  GOALS = 'Goals',
  ASSISTS = 'Assists',
}

export type all = NFL_AND_NCAAF | NBA_AND_NCAAB | MLB | NHL;
export type anyOf =
  | typeof NFL_AND_NCAAF
  | typeof NBA_AND_NCAAB
  | typeof MLB
  | typeof NHL;
