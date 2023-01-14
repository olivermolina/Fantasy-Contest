import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { InferPropTypes, MatchPickRow, PillButtons } from '..';
import { PillButtonsPropTypes } from '../PillButtons/PillButtons';

const betPropTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.number,
  odds: PropTypes.number,
  onClick: PropTypes.func,
};

const teamPropTypes = {
  name: PropTypes.string.isRequired,
  spread: PropTypes.shape(betPropTypes).isRequired,
  total: PropTypes.shape(betPropTypes).isRequired,
  moneyline: PropTypes.shape(betPropTypes).isRequired,
};

export const MatchPickRowPropTypes = {
  id: PropTypes.string.isRequired,
  away: PropTypes.shape(teamPropTypes).isRequired,
  home: PropTypes.shape(teamPropTypes).isRequired,
  matchTime: PropTypes.string,
  onClickOffer: PropTypes.func.isRequired,
};

export const ButtonPropTypes = {
  filters: PillButtonsPropTypes.pills.isRequired,
  matches: PropTypes.arrayOf(PropTypes.shape(MatchPickRowPropTypes).isRequired)
    .isRequired,
};

type Props = InferPropTypes<typeof ButtonPropTypes>;

export const MatchPickRowTable = (props: Props) => {
  return (
    <div>
      <PillButtons pills={props.filters} />
      <div className="flex flex-col gap-2">
        {props.matches.map((items, idx, arr) => (
          <Fragment key={`${items.id}_${items.matchTime}_${idx}`}>
            <MatchPickRow {...items} showHeader={idx === 0} />
            {arr.length - 1 !== idx && <hr />}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

MatchPickRowTable.propTypes = ButtonPropTypes;
