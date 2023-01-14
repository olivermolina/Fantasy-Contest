import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';
import dayjs from 'dayjs';

export const contestCardPropTypes = {
  /**
   * Boolean to show active card styles.
   */
  isActive: PropTypes.bool,
  /**
   * The BG image to be set on the card.
   */
  bgImageUrl: PropTypes.string.isRequired,
  /**
   * A properly formatted start date string i.e. "Mon May 15, 2022"
   */
  startDateString: PropTypes.string.isRequired,
  /**
   * A properly formatted end date string i.e. "Mon May 15, 2022"
   */
  endDateString: PropTypes.string.isRequired,
  /**
   * The name of the given contest. Will be converted to uppercase.
   */
  contestName: PropTypes.string.isRequired,
  /**
   * An event handler for when users click on a contest card.
   */
  onClickCard: PropTypes.func.isRequired,
  /**
   * Show contest dates
   */
  showContestDates: PropTypes.bool,
  /**
   * Boolean to show enrolled styles
   */
  isEnrolled: PropTypes.bool,
};
type Props = InferPropTypes<typeof contestCardPropTypes>;

const CheckIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-blue-500 stroke-green-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const LockIcon = (
  <svg
    className="h-6 w-6 text-white stroke-black"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

/**
 * Contest Card Component
 */
export const ContestCard: React.FC<Props> = ({
  isActive,
  bgImageUrl,
  startDateString,
  endDateString,
  contestName,
  onClickCard,
  showContestDates,
  isEnrolled,
}) => {
  return (
    <button
      onClick={onClickCard}
      className={classNames('relative w-36 h-24 rounded-md text-left', {
        'border-blue-600 border-2': isActive,
      })}
    >
      <img
        className={'left-0 top-0 absolute w-36 h-full opacity-10 object-fill'}
        src={bgImageUrl}
        alt={''}
      />

      <div className={'flex flex-row px-2 items-start justify-between'}>
        <div className="flex flex-col items-start">
          <h4 className="font-extrabold text-sm uppercase">{contestName}</h4>
          {showContestDates ? (
            <h5 className="text-xs text-gray-500">
              {dayjs(startDateString).format('ddd MMM D, YYYY')} - <br />{' '}
              {dayjs(endDateString).format('ddd MMM D, YYYY')}
            </h5>
          ) : (
            <h5 className="text-xs text-gray-500">
              <br /> <br />
            </h5>
          )}
        </div>
        <div>
          {/* Icon */}
          {!isEnrolled ? LockIcon : null}
          {isEnrolled && isActive ? CheckIcon : null}
        </div>
      </div>
    </button>
  );
};

ContestCard.propTypes = contestCardPropTypes;
