import { faker } from '@faker-js/faker';
import { UserType } from '@prisma/client';

export const usersMock = [
  {
    id: '1',
    email: faker.internet.email(),
    username: faker.internet.userName(),
    referral: faker.internet.userName(),
    referralCodes: [
      {
        id: '1',
        userId: '1',
        code: 'cod1',
      },
      {
        id: '2',
        userId: '1',
        code: 'code2',
      },
    ],
    type: UserType.AGENT,
  },
  {
    id: '2',
    email: faker.internet.email(),
    username: faker.internet.userName(),
    referral: faker.internet.userName(),
    referralCodes: [],
    type: UserType.PLAYER,
  },
  {
    id: '3',
    email: faker.internet.email(),
    username: faker.internet.userName(),
    referral: faker.internet.userName(),
    referralCodes: [],
    type: UserType.PLAYER,
  },
  {
    id: '4',
    email: faker.internet.email(),
    username: faker.internet.userName(),
    referral: faker.internet.userName(),
    referralCodes: [],
    type: UserType.PLAYER,
  },
];
