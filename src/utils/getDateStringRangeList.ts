import dayjs from 'dayjs';

/**
 *  This will get a list of dates string between two dates
 *
 *  @param {Date} start - the start date
 *  @param {Date} end- the end date
 *  @param {string} format- date string format (optional, defaults to YYYY-MM-DD).
 *  @returns {array} - the list of dates
 */
export const getDateStringRangeList = (
  start: Date,
  end: Date,
  format = 'YYYY-MM-DD',
): Array<any> => {
  const startDayjs = dayjs(start);
  const endDayjs = dayjs(end);
  const dateStringRangeArray: string[] = [];

  let current = startDayjs;
  while (current.isBefore(endDayjs) || current.isSame(endDayjs)) {
    dateStringRangeArray.push(current.format(format));
    current = current.add(1, 'day');
  }

  return dateStringRangeArray;
};
