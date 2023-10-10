import { prismaMock } from '~/server/singleton';
import { Prisma, TransactionType, User, UserType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import addReferralBonus from '~/server/routers/user/referralBonus/referralBonus';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { ActionType } from '~/constants/ActionType';

jest.mock('~/server/routers/bets/createTransaction', () => ({
  createTransaction: jest.fn(),
}));

jest.mock('~/server/routers/appSettings/list', () => {
  return {
    getUserSettings: jest.fn().mockResolvedValue({
      userAppSettings: [
        { name: 'REFERRAL_CREDIT_AMOUNT', value: 50 },
        { name: 'WEEKLY_REFERRAL_MAX_AMOUNT_EARNED', value: 100 },
      ],
    }),
  };
});

describe('referralBonus', () => {
  const userAgentMock = {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    DOB: new Date('1996-12-16T00:00:00.000Z'),
    isFirstDeposit: true,
    referral: null,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    address1: '60 12th st,',
    address2: '6C',
    city: 'Hoboken',
    state: 'NJ',
    postalCode: '07030',
    identityStatus: true,
    reasonCodes: ['ID-VERIFIED', 'LL-GEO-US-NJ'],
    isAdmin: false,
    phone: null,
    type: UserType.AGENT,
    agentId: null,
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userMock: User = {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    DOB: new Date('1996-12-16T00:00:00.000Z'),
    isFirstDeposit: true,
    referral: null,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    address1: '60 12th st,',
    address2: '6C',
    city: 'Hoboken',
    state: 'NJ',
    postalCode: '07030',
    identityStatus: true,
    reasonCodes: ['ID-VERIFIED', 'LL-GEO-US-NJ'],
    isAdmin: false,
    phone: null,
    type: UserType.PLAYER,
    agentId: null,
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const referredUserMock: User = {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    DOB: new Date('1996-12-16T00:00:00.000Z'),
    isFirstDeposit: true,
    referral: userMock.username,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    address1: '60 12th st,',
    address2: '6C',
    city: 'Hoboken',
    state: 'NJ',
    postalCode: '07030',
    identityStatus: true,
    reasonCodes: ['ID-VERIFIED', 'LL-GEO-US-NJ'],
    isAdmin: false,
    phone: null,
    type: UserType.PLAYER,
    agentId: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not insert a referral bonus if not first deposit anymore', async () => {
    prismaMock.user.update.mockResolvedValue(referredUserMock);
    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.transaction.aggregate.mockResolvedValue({
      _sum: {
        amountBonus: new Prisma.Decimal(0),
      },
      _avg: {
        amountBonus: new Prisma.Decimal(0),
      },
      _max: {
        amountBonus: new Prisma.Decimal(0),
      },
      _min: {
        amountBonus: new Prisma.Decimal(0),
      },
      _count: {
        amountBonus: 0,
      },
    });
    await addReferralBonus(referredUserMock);
    expect(createTransaction).toHaveBeenCalledTimes(0);
  });

  it('should not insert a referral bonus if the user is an agent', async () => {
    prismaMock.user.update.mockResolvedValue(referredUserMock);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    prismaMock.user.findFirst.mockResolvedValue(userAgentMock);
    prismaMock.transaction.aggregate.mockResolvedValue({
      _sum: {
        amountBonus: new Prisma.Decimal(0),
      },
      _avg: {
        amountBonus: new Prisma.Decimal(0),
      },
      _max: {
        amountBonus: new Prisma.Decimal(0),
      },
      _min: {
        amountBonus: new Prisma.Decimal(0),
      },
      _count: {
        amountBonus: 0,
      },
    });

    await addReferralBonus({ ...referredUserMock, isFirstDeposit: true });
    expect(createTransaction).toHaveBeenCalledTimes(0);
  });

  it('should insert a referral bonus if referredUser.isFirstDeposit is true and user type is PLAYER', async () => {
    prismaMock.user.update.mockResolvedValue({ ...referredUserMock });
    prismaMock.user.findFirst.mockResolvedValue(userMock);
    prismaMock.transaction.aggregate.mockResolvedValue({
      _sum: {
        amountBonus: new Prisma.Decimal(0),
      },
      _avg: {
        amountBonus: new Prisma.Decimal(0),
      },
      _max: {
        amountBonus: new Prisma.Decimal(0),
      },
      _min: {
        amountBonus: new Prisma.Decimal(0),
      },
      _count: {
        amountBonus: 0,
      },
    });

    await addReferralBonus({ ...referredUserMock, isFirstDeposit: true });

    expect(createTransaction).toHaveBeenCalledTimes(1);
    expect(createTransaction).toHaveBeenCalledWith({
      userId: userMock.id,
      amountProcess: 0,
      amountBonus: Number(50),
      actionType: ActionType.REFERRAL_FREE_CREDIT,
      transactionType: TransactionType.CREDIT,
    });
  });

  it('should not insert a referral bonus if user already reached weekly max referral credit', async () => {
    prismaMock.user.update.mockResolvedValue({ ...referredUserMock });
    prismaMock.user.findFirst.mockResolvedValue(userMock);
    prismaMock.transaction.aggregate.mockResolvedValue({
      _sum: {
        amountBonus: new Prisma.Decimal(150),
      },
      _avg: {
        amountBonus: new Prisma.Decimal(0),
      },
      _max: {
        amountBonus: new Prisma.Decimal(0),
      },
      _min: {
        amountBonus: new Prisma.Decimal(0),
      },
      _count: {
        amountBonus: 0,
      },
    });

    await addReferralBonus({ ...referredUserMock, isFirstDeposit: true });

    expect(createTransaction).toHaveBeenCalledTimes(0);
  });
});
