import { UserStatus, UserType } from '@prisma/client';
import dayjs from 'dayjs';

export const userMock = {
  id: '1',
  username: 'test',
  password: 'test',
  email: 'test',
  phone: '12345',
  status: UserStatus.ACTIVE,
  firstname: '',
  lastname: 'test',
  address1: 'test',
  address2: 'test',
  city: 'test',
  state: 'test',
  postalCode: 'test',
  DOB: dayjs().toDate(),
  referral: 'test',
  created_at: new Date(),
  isFirstDeposit: true,
  timezone: 'America/New_York',
  notes: '',
  type: UserType.PLAYER,
  exemptedReasonCodes: [],
  agentId: '',
  subAdminIds: [],
};
