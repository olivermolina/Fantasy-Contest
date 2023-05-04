import { UserType } from '@prisma/client';

export const userMock = {
  id: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
  email: 'email',
  username: 'username',
  DOB: new Date('1996-12-16T00:00:00.000Z'),
  isFirstDeposit: false,
  referral: null,
  firstname: 'John',
  lastname: 'Doe',
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
