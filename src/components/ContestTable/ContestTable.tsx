import PropTypes from 'prop-types';
import { InferPropTypes, ContestRow } from '..';
import { ContestRowPropTypes } from '../ContestRow/ContestRow';

const ContestTablePropTypes = {
  contests: PropTypes.arrayOf(PropTypes.shape(ContestRowPropTypes).isRequired)
    .isRequired,
};

type Props = InferPropTypes<typeof ContestTablePropTypes>;

export const ContestTable = (props: Props) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        {props.contests.map((items, idx) => (
          <>
            <ContestRow key={items.id} {...items} showHeader={idx === 0} />
          </>
        ))}
      </div>
    </div>
  );
};

ContestTable.propTypes = ContestTablePropTypes;
