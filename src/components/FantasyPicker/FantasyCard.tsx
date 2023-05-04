import React from 'react';
import { ReactComponent } from '../Icons/Icons';
import { CardTag } from './CardTag';
import classNames from 'classnames';
import FreeSquare from '~/components/FantasyPicker/FreeSquare';

export interface PickCategory {
  /**
   * The id of contest pick category
   */
  id: string;
  /**
   * The number of picks set in the contest pick category
   * @example 2
   */
  numberOfPicks: number;
}

export interface FantasyCardFreeSquareProps {
  /**
   * The id of FreeSquare
   */
  id: string;
  /**
   * Discounted total stats of the line
   * @example 1 to 100
   */
  discount: number;
  /**
   * List of PickCategories
   */
  pickCategories: PickCategory[];
  /**
   * Max stake/bet amout
   * @example 50
   */
  maxStake: number;
  /**
   * Boolean to check if it can be used in a free entry
   */
  freeEntryEnabled: boolean;
}

export interface FantasyCardProps {
  /**
   * Offer Id
   * @example 1234
   */
  id: string;
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
  /**
   * Free square promotion
   */
  freeSquare: FantasyCardFreeSquareProps | null;
}

export const FantasyCard = (props: FantasyCardProps) => {
  const Image = props.image;

  {
    /* Fantasy Card */
  }
  return (
    <div
      className={classNames(
        'flex flex-col justify-start w-full rounded-lg flex-col bg-primary',
        {
          'bg-[#0b4893]': props.isSelected,
        },
        { 'rounded-lg': props.freeSquare === undefined },
      )}
    >
      {/* Free Square */}
      {!!props.freeSquare ? (
        <FreeSquare
          discount={props.freeSquare.discount}
          gameDateTime={`${props.matchTime}`}
        />
      ) : null}

      {/* Fantasy Image */}
      <div
        className={classNames(
          'flex justify-center item-center py-2 rounded-t-lg',
          {
            'bg-[#144E97FF]': props.isSelected,
            'bg-[#093A75FF]': !props.isSelected,
          },
        )}
      >
        {typeof props.image === 'string' ? (
          <img
            src={props.image}
            className={classNames('rounded-lg', {
              'w-24 h-24': props.imageSize === 'small',
              'w-36 h-36': props.imageSize === 'medium',
              'w-64 h-auto': !props.imageSize, // default
              'w-80 h-auto': props.imageSize === 'large',
            })}
            alt=""
          />
        ) : (
          <Image className="rounded-lg max-w-full h-45 w-52" />
        )}
      </div>
      {/* Control Box */}
      <div
        className={classNames(
          'flex flex-col justify-start p-2 lg:p-4 gap-2 rounded-b-lg',
          {
            'bg-[#0b4893]': props.isSelected,
            'bg-[#003370FF]': !props.isSelected,
          },
        )}
      >
        {/* Button Group */}
        <div className={'flex justify-between gap-2'}>
          <button
            onClick={props.onClickMore}
            className={classNames(
              'flex-grow border text-white font-bold rounded p-2 lg:p-3 text-sm capitalize',
              {
                'bg-white text-primary': props.isSelected && props.isOver,
                'bg-selected': props.isSelected && !props.isOver,
              },
            )}
          >
            More
          </button>
          <button
            onClick={props.onClickLess}
            className={classNames(
              'flex-grow border text-white font-bold rounded p-2 lg:p-3 text-sm capitalize',
              {
                'bg-white text-primary': props.isSelected && !props.isOver,
                'bg-selected text-white': props.isSelected && props.isOver,
              },
            )}
          >
            Less
          </button>
        </div>
        <div className={'flex flex-row justify-between gap-1'}>
          <div className={'flex flex-col justify-start'}>
            {/* Stat Line */}
            <div className="flex flex-wrap gap-0.5 lg:gap-2 items-center">
              <div className={'flex items-baseline text-white'}>
                <span
                  className={classNames('font-bold', {
                    'text-sm line-through decoration-red-500':
                      !!props.freeSquare,
                    'text-xl lg:text-3xl': !props.freeSquare,
                  })}
                >
                  {props.value}
                </span>
                {/* Discounted value */}
                {props.freeSquare && (
                  <span className="font-bold text-xl lg:text-3xl">
                    {(
                      props.value -
                      props.value * (props.freeSquare.discount / 100)
                    ).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-sm text-lightText text-center">
                {props.stat}
              </div>
            </div>
            {/* Player Name */}
            <div className="font-bold text-md lg:text-lg text-white">
              {props.playerName}
            </div>
          </div>
          <div
            className={'flex flex-col items-end justify-start gap-1 lg:gap-2'}
          >
            {/* Game DateTime */}
            <div className="text-xs lg:text-md text-lightText text-end">
              {props.matchTime}
            </div>
            {/* Team Matchup */}
            <div className="text-xs lg:text-md text-lightText text-end">
              {props.gameInfo}
            </div>
            {/* Card Tags */}
            <div className="flex flex-wrap justify-end gap-0.5 lg:gap-2">
              <CardTag>{props.playerPosition}</CardTag>
              <CardTag>{props.playerTeam}</CardTag>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
