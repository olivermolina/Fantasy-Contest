// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type PropTypes from 'prop-types';

export type InferPropTypes<
  PropTypes,
  DefaultProps = unknown,
  Props = PropTypes.InferProps<PropTypes>,
> = {
  [Key in keyof Props]: Key extends keyof DefaultProps
    ? Props[Key] | DefaultProps[Key]
    : Props[Key];
};

export { AvatarCircle } from './AvatarCircle';
export { ContestPicker } from './ContestPicker/ContestPicker';
export { ContestCard } from './ContestPicker/ContestCard';
export { PillButtons } from './PillButtons/PillButtons';
export { PillButton } from './PillButtons/PillButton';
export { MatchPickRowTable } from './MatchPickRowTable/MatchPickRowTable';
export * from './MatchPickRow';
export * from './Alert';
export * from './Cart';
export * from './Layout';
export * from './ContestRow';
export * from './ContestTable';
export * from './LeaderBoardRow';
export * from './LeaderBoardTable';
export * from './TabPanel';
export * from './Modal';
export * from './Header';
