import PropTypes from 'prop-types';
import { InferPropTypes } from '..';
import { RowContents } from './RowContents';
import { LeadersColumnPropTypes } from './TopLeaders';

const avatarPropTypes = {
  imgSrc: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  variant: PropTypes.string.isRequired,
};

export const ContestRowPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.shape(avatarPropTypes).isRequired,
  showHeader: PropTypes.bool,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  leaders: PropTypes.arrayOf(
    PropTypes.shape(LeadersColumnPropTypes).isRequired,
  ),
  onClickJoinContest: PropTypes.func.isRequired,
  entryFee: PropTypes.number.isRequired,
  totalPrize: PropTypes.number.isRequired,
  entries: PropTypes.number.isRequired,
  isJoined: PropTypes.bool.isRequired,
};

type Props = InferPropTypes<typeof ContestRowPropTypes>;

export const ContestRow = (props: Props) => {
  return (
    <div>
      {props.showHeader && (
        <div className="lg:grid grid-cols-[1fr_.5fr_.5fr_.5fr_1fr] p-1 pl-4 hidden">
          <div className="w-96 text-sm font-bold">CONTESTS</div>
          <div className="w-28 text-sm font-bold pl-8">ENTRY FEE</div>
          <div className="w-28 text-sm font-bold pl-2">TOTAL PRIZES</div>
          <div className="w-28 text-sm font-bold pl-2">ENTRIES</div>
          <div className="w-96 text-sm font-bold pl-3">LEADERBOARD</div>
        </div>
      )}
      <div className="border-t-2">
        <RowContents
          id={props.id}
          avatar={props.avatar}
          name={props.name}
          startDate={props.startDate}
          endDate={props.endDate}
          onClickJoinContest={() => {
            props.onClickJoinContest();
          }}
          leaders={props.leaders}
          entryFee={props.entryFee}
          totalPrize={props.totalPrize}
          entries={props.entries}
          isJoined={props.isJoined}
        />
      </div>
    </div>
  );
};

ContestRow.propTypes = ContestRowPropTypes;
