import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Skeleton } from '@mui/material';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export interface FreeSquareProps {
  /**
   * Free square discount
   * @example 95
   */
  discount: number;
  /**
   * Game date time as the expiry of the free square promo
   * @example '2022-10-02 13:35:01',
   */
  gameDateTime: string;
}

/**
 * The Free Square Box promotion on top of the FantasyCard component
 */
export default function FreeSquare(props: FreeSquareProps) {
  const { gameDateTime, discount } = props;

  const [time, setTime] = useState<string>();

  useMemo(() => {
    const currentTime = dayjs();
    const gameTimeTz = dayjs(gameDateTime).tz('America/New_York', true);
    const diffTime = dayjs(gameTimeTz).unix() - currentTime.unix();

    let duration = dayjs.duration(diffTime * 1000, 'milliseconds');
    const interval = 1000;
    const twoDP = (n: number) => (n > 9 ? n : '0' + n);

    setInterval(function () {
      duration = dayjs.duration(
        duration.asMilliseconds() - interval,
        'milliseconds',
      );

      const days = duration.days() > 0 ? `${twoDP(duration.days()) + 'd'}` : '';
      const hours = duration.hours() + 'h';
      const minutes = twoDP(duration.minutes()) + 'm';
      const seconds = twoDP(duration.seconds()) + 's';

      const timestamp = `${days} ${hours} ${minutes} ${seconds}`;
      setTime(timestamp);
    }, interval);
  }, [gameDateTime]);

  return (
    <div
      className={
        'flex justify-evenly p-1 rounded-t-lg bg-yellow-600 font-bold text-white items-center text-xs sm:text-sm md:text-md lg:text-lg'
      }
    >
      {time ? (
        <span
          className={
            'bg-black text-white px-1 lg:px-2 rounded-sm whitespace-nowrap'
          }
        >
          {time}
        </span>
      ) : (
        <Skeleton sx={{ width: 150 }} />
      )}
      <p className={'whitespace-nowrap text-black'}>{discount}% OFF</p>
    </div>
  );
}
