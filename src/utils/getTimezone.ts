/**
 * Retrieves the local timezone in the format 'America/New_York'.
 * @returns The local timezone string.
 */
export const getTimezone = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZoneName: 'long',
  };

  const formatter = new Intl.DateTimeFormat([], options);
  const timeZone: string = formatter.resolvedOptions().timeZone;

  return timeZone;
};
