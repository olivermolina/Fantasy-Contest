import { getDateStringRangeList } from './getDateStringRangeList';

describe('getDateStringRangeList', () => {
  it('returns the list of dates between two dates', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-03');

    expect(getDateStringRangeList(start, end)).toStrictEqual([
      '2023-01-01',
      '2023-01-02',
      '2023-01-03',
    ]);
  });

  it('returns the list of dates between two dates using different format', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-03');
    const format = 'MM/DD/YYYY';

    expect(getDateStringRangeList(start, end, format)).toStrictEqual([
      '01/01/2023',
      '01/02/2023',
      '01/03/2023',
    ]);
  });
});
