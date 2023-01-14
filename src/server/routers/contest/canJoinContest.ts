import { Contest, ContestEntry } from '@prisma/client';
import dayjs from 'dayjs';

/**
 * A user can only join a contest if its not yet been started and they're not yet enrolled.
 */
export const canJoinContest = (
  contest: Contest & {
    ContestEntries: ContestEntry[];
  },
  userId: string,
) => {
  if (dayjs().isAfter(dayjs(contest.startDate))) {
    return false;
  }
  const isUserAlreadyJoined = contest.ContestEntries.some(
    (entry) => entry.userId === userId,
  );
  if (isUserAlreadyJoined) {
    return false;
  }
  return true;
};
