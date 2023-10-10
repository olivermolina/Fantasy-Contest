import { formatMatchTime } from './formatMatchTime';

describe('formatMatchTime', () => {
  it('should return an empty string if both gamedate and gametime are not provided', () => {
    const result = formatMatchTime();
    expect(result).toEqual('Dec 31, 2020 07:00 PM');
  });

  it('should format the match time correctly if gamedate and gametime are provided', () => {
    const gamedate = '05-26-2023';
    const gametime = '15:30';
    const result = formatMatchTime(gamedate, gametime);
    expect(result).toEqual('May 26, 2023 03:30 PM');
  });

  it('should format the match time correctly if only gamedate is provided', () => {
    const gamedate = '05-26-2023';
    const result = formatMatchTime(gamedate);
    expect(result).toEqual('May 26, 2023 12:00 AM');
  });

  it('should format the match time correctly if only gametime is provided', () => {
    const gametime = '15:30';
    const result = formatMatchTime(undefined, gametime);
    expect(result).toEqual('Dec 31, 2020 03:30 PM');
  });

  it('should return an empty string if the provided gamedate is invalid', () => {
    const gamedate = 'invalid-date';
    const gametime = '15:30';
    const result = formatMatchTime(gamedate, gametime);
    expect(result).toEqual('Dec 31, 2020 07:00 PM');
  });
});
