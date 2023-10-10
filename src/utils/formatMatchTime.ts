import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customFormat from 'dayjs/plugin/customParseFormat';
import { EntryDatetimeFormat } from '~/constants/EntryDatetimeFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customFormat);
/*
 * Format match time
 * @param gamedate - The game date
 * @param gametime - The game time
 *
 * @returns {string} - Returns the formatted match time
 */
export const formatMatchTime = (gamedate?: string, gametime?: string) => {
  if (!gamedate && !gametime) {
    return dayjs().tz('America/New_York').format(EntryDatetimeFormat);
  }

  if (dayjs(gamedate, 'DD/MM/YYYY').isValid()) {
    return dayjs
      .tz(`${gamedate} ${gametime || '00:00:00'}`, 'America/New_York')
      .format(EntryDatetimeFormat);
  }

  if (gametime && !gamedate) {
    const today = dayjs().tz('America/New_York').format('MM/DD/YYYY');
    return dayjs
      .tz(`${today} ${gametime}`, 'America/New_York')
      .format(EntryDatetimeFormat);
  }

  if (!dayjs(gamedate).isValid()) {
    return dayjs().tz('America/New_York').format(EntryDatetimeFormat);
  }

  return dayjs
    .tz(`${gamedate} ${gametime || '00:00:00'}`, 'America/New_York')
    .format(EntryDatetimeFormat);
};
