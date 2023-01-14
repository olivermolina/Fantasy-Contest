import React from 'react';
import { ReactComponent } from '../Icons/Icons';
import { CardTag } from './CardTag';
import classNames from 'classnames';

export interface FantasyCardProps {
  onClickMore: React.MouseEventHandler<HTMLButtonElement>;
  onClickLess: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Image URL
   * @example https://mysite.com/image.png
   */
  image: ReactComponent | string;
  /**
   * Stat Value
   * @example 99.5
   */
  value: number;
  /**
   * Stat Name
   * @example Passing Yards
   */
  stat: string;
  /**
   * Game Information
   * @example LA@DEN
   */
  gameInfo: string;
  /**
   * Player Name
   * @example Patrick Mahomes
   */
  playerName: string;
  /**
   * Custom image size
   * ie. small, medium, large
   * @example small
   */
  imageSize?: string;
  /**
   * Boolean to show selected card styles.
   */
  isSelected?: boolean;
  /**
   * Boolean to show selected More/Less button.
   */
  isOver?: boolean;
  /**
   * Player Position
   * @example QB
   */
  playerPosition: string;
  /**
   * Player Team
   * @example KC
   */
  playerTeam: string;
  /**
   * Game time
   * @example '2022-10-02 13:35:01',
   */
  matchTime?: string;
}

export const FantasyCard = (props: FantasyCardProps) => {
  const Image = props.image;

  {
    /* Fantasy Card */
  }
  return (
    <div
      className={classNames(
        'rounded-lg w-full shadow inline-flex flex-col bg-white p-2',
        {
          'border-2 border-blue-200 bg-blue-50': props.isSelected,
        },
      )}
    >
      {/* Fantasy Image */}
      <div className={'flex justify-center item-center'}>
        {typeof props.image === 'string' ? (
          <img
            src={props.image}
            className={classNames('rounded-lg', {
              'w-36 h-36': props.imageSize === 'small',
              'w-64 h-64': props.imageSize === 'medium',
              'w-80 h-auto': !props.imageSize, // default
              'w-96 h-auto': props.imageSize === 'large',
            })}
            alt=""
          />
        ) : (
          <Image className="rounded-lg max-w-full h-45 w-52" />
        )}
      </div>
      {/* Control Box */}
      <div className="grid gap-3 p-4">
        {/* Button Group */}
        <div className="flex gap-2">
          <button
            onClick={props.onClickMore}
            className={classNames(
              'flex-grow border text-black border-blue-200 font-bold rounded p-3 text-sm capitalize',
              {
                'border-blue-200': props.isSelected,
                'bg-blue-200 text-blue-800': props.isSelected && props.isOver,
              },
            )}
          >
            More
          </button>
          <button
            onClick={props.onClickLess}
            className={classNames(
              'flex-grow border text-black border-blue-200 font-bold rounded p-3 text-sm capitalize',
              {
                'border-blue-200': props.isSelected,
                'bg-blue-200 text-blue-800': props.isSelected && !props.isOver,
              },
            )}
          >
            Less
          </button>
        </div>
        {/* Stat Line */}
        <div className="flex gap-2">
          <span className="font-bold text-3xl text-black leading-10">
            {props.value}
          </span>
          <div className="text-sm text-gray-500">
            {props.stat} <br />
            {props.gameInfo}
          </div>
        </div>
        {/* Player Name */}
        <div className="font-bold text-lg text-black">{props.playerName}</div>
        {/* Game DateTime */}
        <div className="text-sm text-gray-500">{props.matchTime}</div>
        {/* Card Tags */}
        <div className="flex gap-2">
          <CardTag>{props.playerPosition}</CardTag>
          <CardTag>{props.playerTeam}</CardTag>
        </div>
      </div>
    </div>
  );
};
