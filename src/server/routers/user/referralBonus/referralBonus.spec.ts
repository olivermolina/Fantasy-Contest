import { prismaMock } from '~/server/singleton';
import {
  AppSettingName,
  TransactionType,
  User,
  UserType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import addReferralBonus from '~/server/routers/user/referralBonus/referralBonus';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { ActionType } from '~/constants/ActionType';

jest.mock('~/server/routers/bets/createTransaction', () => ({
  createTransaction: jest.fn(),
}));

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
  const referralAppSettingMock = {
    id: faker.datatype.uuid(),
    name: AppSettingName.REFERRAL_CREDIT_AMOUNT,
    value: '50',
  };

  it('should not insert a referral bonus if not first deposit anymore', async () => {
    prismaMock.user.update.mockResolvedValue(referredUserMock);
    prismaMock.user.findFirst.mockResolvedValue(null);
    await addReferralBonus(referredUserMock);
    expect(createTransaction).toHaveBeenCalledTimes(0);
  });

  it('should not insert a referral bonus if the user is an agent', async () => {
    prismaMock.user.update.mockResolvedValue(referredUserMock);
    prismaMock.user.findFirst.mockResolvedValue(userAgentMock);

    await addReferralBonus({ ...referredUserMock, isFirstDeposit: true });
    expect(createTransaction).toHaveBeenCalledTimes(0);
  });

  it('should insert a referral bonus if referredUser.isFirstDeposit is true and user type is PLAYER', async () => {
    prismaMock.user.update.mockResolvedValue({ ...referredUserMock });
    prismaMock.user.findFirst.mockResolvedValue(userMock);
    prismaMock.appSettings.findFirst.mockResolvedValue(referralAppSettingMock);

    await addReferralBonus({ ...referredUserMock, isFirstDeposit: true });

    expect(createTransaction).toHaveBeenCalledTimes(1);
    expect(createTransaction).toHaveBeenCalledWith({
      userId: userMock.id,
      amountProcess: 0,
      amountBonus: Number(referralAppSettingMock?.value),
      actionType: ActionType.ADD_FREE_CREDIT,
      transactionType: TransactionType.CREDIT,
    });
  });
});
