export const playerMock = {
  id: 'player-id',
  username: 'Danielgroup12',
  firstname: 'DANIEL',
  lastname: 'GROUP',
  agent: null,
  isFirstDeposit: false,
  referral: '',
  Bets: [
    {
      id: 'bet-1',
      userId: 'player-id',
      created_at: new Date('2023-01-30T05:00:00.000Z'),
      updated_at: new Date('2023-01-30T05:00:00.000Z'),
      status: 'WIN',
      stake: 10,
      payout: 30,
      bonusCreditStake: 0,
    },
    {
      id: 'bet-1',
      userId: 'player-id',
      created_at: new Date('2023-01-30T05:00:00.000Z'),
      updated_at: new Date('2023-01-30T05:00:00.000Z'),
      status: 'LOSS',
      stake: 10,
      payout: 15,
      bonusCreditStake: 0,
    },
    {
      id: 'bet-2',
      userId: 'player-id',
      created_at: new Date('2023-01-31T05:00:00.000Z'),
      updated_at: new Date('2023-01-31T05:00:00.000Z'),
      status: 'WIN',
      stake: 5,
      payout: 50,
      bonusCreditStake: 0,
    },
    {
      id: 'bet-3',
      userId: 'player-id',
      created_at: new Date('2023-01-31T05:00:00.000Z'),
      updated_at: new Date('2023-01-31T05:00:00.000Z'),
      status: 'LOSS',
      stake: 50,
      payout: 250,
      bonusCreditStake: 0,
    },
    {
      id: 'bet-4',
      userId: 'player-id',
      created_at: new Date('2023-02-01T05:00:00.000Z'),
      updated_at: new Date('2023-02-01T05:00:00.000Z'),
      status: 'WIN',
      stake: 5,
      payout: 15,
      bonusCreditStake: 0,
    },
    {
      id: 'bet-4',
      userId: 'player-id',
      created_at: new Date('2023-02-01T05:00:00.000Z'),
      updated_at: new Date('2023-02-01T05:00:00.000Z'),
      status: 'LOSS',
      stake: 50,
      payout: 30,
      bonusCreditStake: 0,
    },
    {
      id: 'bet-5',
      userId: 'player-id',
      created_at: new Date('2023-02-03T05:00:00.000Z'),
      updated_at: new Date('2023-02-03T05:00:00.000Z'),
      status: 'PENDING',
      stake: 10,
      payout: 30,
      bonusCreditStake: 0,
    },
    {
      id: 'bet-6',
      userId: 'player-id',
      created_at: new Date('2023-02-04T05:00:00.000Z'),
      updated_at: new Date('2023-02-04T05:00:00.000Z'),
      status: 'PENDING',
      stake: 10,
      payout: 30,
      bonusCreditStake: 0,
    },
    {
      id: 'bet-7',
      userId: 'player-id',
      created_at: new Date('2023-02-05T05:00:00.000Z'),
      updated_at: new Date('2023-02-05T05:00:00.000Z'),
      status: 'CANCELLED',
      stake: 10,
      payout: 30,
      bonusCreditStake: 0,
    },
    {
      id: 'bet-8',
      userId: 'player-id',
      created_at: new Date('2023-02-05T05:00:00.000Z'),
      updated_at: new Date('2023-02-05T05:00:00.000Z'),
      status: 'REFUNDED',
      stake: 10,
      payout: 30,
      bonusCreditStake: 0,
    },
  ],
  Transactions: [
    {
      id: 'trans-1',
      userId: 'player-id',
      created_at: new Date('2023-02-01T05:00:00.000Z'),
      amountProcess: 50,
      actionType: 'PAY',
      TransactionStatuses: [
        {
          id: 'trans-status-1',
          statusCode: 1, // COMPLETED
        },
      ],
    },
    {
      id: 'trans-2',
      userId: 'player-id',
      created_at: new Date('2023-02-01T05:00:00.000Z'),
      amountProcess: 10,
      actionType: 'PAY',
      TransactionStatuses: [
        {
          id: 'trans-status-1',
          statusCode: 0, // PENDING
        },
      ],
    },
    {
      id: 'trans-3',
      userId: 'player-id',
      created_at: new Date('2023-02-01T05:00:00.000Z'),
      amountProcess: 50,
      actionType: 'PAY',
      TransactionStatuses: [
        {
          id: 'trans-status-1',
          statusCode: 3, // Failed
        },
      ],
    },
    {
      id: 'trans-3',
      userId: 'player-id',
      created_at: new Date('2023-02-01T05:00:00.000Z'),
      amountProcess: 1,
      actionType: 'PAYOUT',
      TransactionStatuses: [
        {
          id: 'trans-status-2',
          statusCode: 1, // COMPLETED
        },
      ],
    },
    {
      id: 'trans-3',
      userId: 'player-id',
      created_at: new Date('2023-02-01T05:00:00.000Z'),
      amountProcess: 5,
      actionType: 'PAYOUT',
      TransactionStatuses: [
        {
          id: 'trans-status-2',
          statusCode: 0, // PENDING
        },
      ],
    },
    {
      id: 'trans-4',
      userId: 'player-id',
      created_at: new Date('2023-02-01T05:00:00.000Z'),
      amountProcess: 10,
      actionType: 'PAYOUT',
      TransactionStatuses: [
        {
          id: 'trans-status-3',
          statusCode: 3, // FAILED
        },
      ],
    },
  ],
};
