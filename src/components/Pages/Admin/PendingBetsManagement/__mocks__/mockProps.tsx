import { BetStatus } from '@prisma/client';
import {
  LegRowModel,
  RowModel,
} from '~/components/Pages/Admin/PendingBetsManagement/PendingBetsManagement';

export const mockProps = {
  settlePick: (currentRow: RowModel, betStatus: BetStatus) => {
    console.log('click');
  },
  data: [
    {
      ticket: '1',
      placed: new Date('1970-01-01T01:00:00.000Z'),
      userPhone: '1',
      username: 'username',
      description: '1',
      riskWin: '1',
      legs: [
        {
          id: '1',
          name: 'name',
          type: 'type',
          odds: 100,
          category: 'Assist',
          total: 5,
          total_stat: 5,
          status: BetStatus.WIN,
        },
      ],
      name: 'John Doe',
      status: 'Pending',
      type: 'Parlay',
    },
    {
      ticket: '2',
      placed: new Date('1970-01-01T01:00:00.000Z'),
      userPhone: '2',
      username: 'username',
      description: '2',
      riskWin: '2',
      legs: [
        {
          id: '2',
          name: 'name',
          type: 'type',
          odds: 100,
          category: 'Assist',
          total: 5,
          total_stat: 5,
          status: BetStatus.REFUNDED,
        },
      ],
      name: 'John Doe',
      status: 'Pending',
      type: 'Parlay',
    },
    {
      ticket: '3',
      placed: new Date('1970-01-01T01:00:00.000Z'),
      userPhone: '3',
      username: 'username',
      description: '3',
      riskWin: '3',
      legs: [
        {
          id: '3',
          name: 'name',
          type: 'type',
          odds: 100,
          category: 'Assist',
          total: 5,
          total_stat: 5,
          status: BetStatus.CANCELLED,
        },
      ],
      name: 'John Doe',
      status: 'Pending',
      type: 'Parlay',
    },
  ],
  updateBetLeg: (leg: LegRowModel, status: BetStatus) => {
    console.log('click');
  },
};
