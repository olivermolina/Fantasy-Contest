import PropTypes from 'prop-types';
import { InferPropTypes } from '..';
import { RowContents } from './RowContents';

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
  away: PropTypes.shape(teamPropTypes).isRequired,
  home: PropTypes.shape(teamPropTypes).isRequired,
  showHeader: PropTypes.bool,
  matchTime: PropTypes.string,
  onClickOffer: PropTypes.func.isRequired,
};

type Props = InferPropTypes<typeof MatchPickRowPropTypes>;

export const MatchPickRow = (props: Props) => {
  return (
    <div>
      {props.showHeader && (
        <div className="flex pb-2 text-gray-400 justify-end mr-1 gap-1">
          <div className="w-14 text-xs">Spread</div>
          <div className="w-14 text-xs">Total</div>
          <div className="w-14 text-xs">Moneyline</div>
        </div>
      )}
      <div className="flex bg-white justify-between border border-b-0 border-gray-200 rounded rounded-b-none p-1 grid-cols-12">
        <RowContents
          teamName={props.away.name}
          onClickOffer={(type) => {
            props.onClickOffer('away', type);
          }}
          spread={{
            disabled: !!props.away.spread.disabled,
            value: `${props.away.spread.value}`,
            odds: `${props.away.spread.odds}`,
          }}
          total={{
            disabled: !!props.away.total.disabled,
            value: `O ${props.away.total.value}`,
            odds: `${props.away.total.odds}`,
          }}
          moneyline={{
            disabled: !!props.away.moneyline.disabled,
            value: `${props.away.moneyline.value}`,
          }}
        />
      </div>
      <div className="flex bg-white justify-between border border-b-0 rounded-t-none rounded-b-none border-gray-200 rounded p-1 grid-cols-12">
        <RowContents
          teamName={props.home.name}
          onClickOffer={(type) => {
            props.onClickOffer('home', type);
          }}
          spread={{
            disabled: !!props.home.spread.disabled,
            value: `${props.home.spread.value}`,
            odds: `${props.home.spread.odds}`,
          }}
          total={{
            disabled: !!props.home.total.disabled,
            value: `U ${props.home.total.value}`,
            odds: `${props.home.total.odds}`,
          }}
          moneyline={{
            disabled: !!props.home.moneyline.disabled,
            value: `${props.home.moneyline.value}`,
          }}
        />
      </div>
      <div className="bg-slate-100 border border-gray-200 rounded rounded-t-none px-2 py-1 text-xs text-slate-400">
        {props.matchTime}
      </div>
    </div>
  );
};

MatchPickRow.propTypes = MatchPickRowPropTypes;
