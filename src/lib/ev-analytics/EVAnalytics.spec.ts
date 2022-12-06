import { formatDate, formatGetLeagueURL, LeagueEnum } from './EVAnaltyics';

describe('EVAnaltyics', () => {
  it('should properly format getLeague params', () => {
    const params = new URLSearchParams({
      game: '1',
      date: formatDate(new Date(0)),
    });
    expect(formatGetLeagueURL(LeagueEnum.NBA, params)).toBe(
      'https://api.evanalytics.com/odds/v1/leagues/nba?game=1&date=1969-12-31',
    );
  });

  it('should properly format getLeague params when params are empty', () => {
    const params = new URLSearchParams();
    expect(formatGetLeagueURL(LeagueEnum.NBA, params)).toBe(
      'https://api.evanalytics.com/odds/v1/leagues/nba?',
    );
  });
});
