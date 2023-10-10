import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import en from 'dayjs/locale/en';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.locale({
  ...en,
  weekStart: 1,
});

export default function getWeeksInMonth(month: number, year: number) {
  // Define the custom format for parsing dates
  const dateFormat = 'YYYY-MM-DD';

  // Get the first day of the month
  const firstDayOfMonth = dayjs(`${year}-${month}-01`, { format: dateFormat });

  // Find the first Monday of the month
  let currentWeekStart = firstDayOfMonth;
  while (currentWeekStart.day() !== 1) {
    currentWeekStart = currentWeekStart.add(1, 'day');
  }

  // Initialize an array to store the week ranges
  const weekRanges = [];

  while (currentWeekStart.month() + 1 === month) {
    const currentWeekEnd = currentWeekStart.clone().endOf('week');

    // Determine the end date for the week, considering the end of the month
    const endOfMonth = dayjs(`${year}-${month}-01`, {
      format: dateFormat,
    }).endOf('month');
    const endDate = currentWeekEnd.isAfter(endOfMonth)
      ? endOfMonth
      : currentWeekEnd;

    // Add the week range to the array
    weekRanges.push({
      start: dayjs(`${year}-${month}-${currentWeekStart.date()}`, {
        format: dateFormat,
      }),
      end: dayjs(`${year}-${month}-${endDate.date()}`, {
        format: dateFormat,
      }),
    });

    // Move to the next week
    currentWeekStart = currentWeekStart.add(1, 'week');
  }

  const initialFirstWeek = weekRanges[0];
  // Add the first week if it doesn't start on the first day of the month
  if (Number(initialFirstWeek?.start.get('date')) > 1) {
    const end = Number(initialFirstWeek?.start?.get('date')) - 1;
    weekRanges.unshift({
      start: dayjs(`${year}-${month}-01`, {
        format: dateFormat,
      }),
      end: dayjs(`${year}-${month}-${end}`, {
        format: dateFormat,
      }),
    });
  }

  const initialLastWeek = weekRanges[weekRanges.length - 1];
  const lastDayOfMonth = firstDayOfMonth.endOf('month').date();
  // Add the last week if it doesn't end on the last day of the month
  if (Number(initialLastWeek?.end.get('date')) < lastDayOfMonth) {
    const start = Number(initialFirstWeek?.end?.get('date')) + 1;
    weekRanges.push({
      start: dayjs(`${year}-${month}-${start}`, {
        format: dateFormat,
      }),
      end: dayjs(`${year}-${month}-${lastDayOfMonth}`, {
        format: dateFormat,
      }),
    });
  }

  return weekRanges;
}
