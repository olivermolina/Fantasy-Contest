import dayjs from 'dayjs';
import { prisma } from '~/server/prisma';
import { ContestType } from '@prisma/client';
import { MORE_OR_LESS_CONTEST_ID } from '~/constants/MoreOrLessContestId';

export const getMoreLessContest = async () => {
  const contestId = MORE_OR_LESS_CONTEST_ID;
  const contestData = {
    name: 'MORE OR LESS CONTEST',
    description: 'This is a more or less contest',
    isActive: true,
    startDate: dayjs().subtract(1, 'h').toDate(),
    endDate: dayjs().add(50, 'year').toDate(),
    type: ContestType.FANTASY,
    bgImageUrl: 'https://picsum.photos/200',
    entryFee: 200,
    totalPrize: 1000,
  };

  return await prisma.contest.upsert({
    where: {
      id: contestId,
    },
    create: {
      ...contestData,
      id: contestId,
      created_at: new Date(),
      updated_at: new Date(),
    },
    update: contestData,
  });
};
