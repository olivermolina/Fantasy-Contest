import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';
import classNames from 'classnames';

export const LeadersColumnPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rank: PropTypes.number.isRequired,
  isMe: PropTypes.bool.isRequired,
  onClickYourself: PropTypes.func.isRequired,
};

const TopLeadersPropTypes = {
  leaders: PropTypes.arrayOf(PropTypes.shape(LeadersColumnPropTypes).isRequired)
    .isRequired,
};

type Props = InferPropTypes<typeof TopLeadersPropTypes>;

export const TopLeaders = (props: Props) => {
  return (
    <div className="hidden lg:block">
      <div className="font-bold">Top 3 Players : </div>
      {props.leaders.map((leader) => {
        return (
          <>
            <div
              className={classNames('text-base', {
                'text-blue-500': leader.isMe,
              })}
            >
              <button disabled={!leader.isMe} onClick={leader.onClickYourself}>
                {`${leader.rank + 1} ) `}{' '}
                {`${leader.isMe ? 'You' : '@' + leader.name}`}
              </button>
            </div>
          </>
        );
      })}
    </div>
  );
};

TopLeaders.propTypes = TopLeadersPropTypes;
