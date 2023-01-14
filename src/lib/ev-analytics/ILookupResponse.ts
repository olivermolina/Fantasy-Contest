interface Game {
  id: number;
  date: string;
  matchup: string;
  teams: {
    id: number;
    name: string;
    abbreviation: string;
    homeaway: string;
  }[];
  double_header: boolean;
  gameorder: number;
}

interface Team {
  id: string;
  name: string;
  abbreviation: string;
  nickname: string;
}

interface Player {
  id: string;
  name: string;
  position: string;
  teamid: string;
  team: string;
  headshot: string;
}

export interface ILookupRepsonse {
  games: Record<Game['id'], Game>;
  teams: Team[];
  players: Player[];
}
