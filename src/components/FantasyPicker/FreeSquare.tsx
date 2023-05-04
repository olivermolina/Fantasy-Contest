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
    const currentTime = dayjs().tz('America/New_York');
    const gameTimeTz = dayjs(`${gameDateTime} EST`).tz('America/New_York');
    const diffTime = dayjs(gameTimeTz).unix() - currentTime.unix();

    let duration = dayjs.duration(diffTime * 1000, 'milliseconds');
    const interval = 1000;
    const twoDP = (n: number) => (n > 9 ? n : '0' + n);

    setInterval(function () {
      duration = dayjs.duration(
        duration.asMilliseconds() - interval,
        'milliseconds',
      );
      const timestamp = `${
        duration.days() && duration.days() + 'd '
      }${duration.hours()}h ${twoDP(duration.minutes())}m ${twoDP(
        duration.seconds(),
      )}s`;
      setTime(timestamp);
    }, interval);
  }, [gameDateTime]);

  return (
    <div
      className={
        'flex justify-evenly p-1 rounded-t-lg bg-yellow-600 font-bold text-md lg:text-md text-white '
      }
    >
      {time ? (
        <span
          className={
            'bg-black text-white px-1 lg:px-4 rounded-sm whitespace-nowrap'
          }
        >
          {time}
        </span>
      ) : (
        <Skeleton sx={{ width: 150 }} />
      )}
      <span className={'whitespace-nowrap text-black'}>{discount}% OFF</span>
    </div>
  );
}
