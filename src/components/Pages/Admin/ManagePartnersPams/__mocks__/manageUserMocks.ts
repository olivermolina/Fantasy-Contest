import { UserStatus, UserType } from '@prisma/client';
import { NEW_USER_ID } from '~/constants/NewUserId';

export const subAdminUsersMock = [
  {
    id: 'subAdmin1',
    email: 'test2@test.test',
    username: 'subAdmin1',
    status: UserStatus.ACTIVE,
    type: UserType.SUB_ADMIN,
    phone: '123456789',
    subAdminId: '',
  },
  {
    id: 'subAdmin2',
    email: 'test2@test.test',
    username: 'subAdmin2',
    status: UserStatus.ACTIVE,
    type: UserType.SUB_ADMIN,
    phone: '123456789',
    subAdminId: '',
  },
  {
    id: 'subAdmin3',
    email: 'test2@test.test',
    username: 'subAdmin3',
    status: UserStatus.ACTIVE,
    type: UserType.SUB_ADMIN,
    phone: '123456789',
    subAdminId: '',
  },
  {
    id: 'subAdmin4',
    email: 'test2@test.test',
    username: 'subAdmin4',
    status: UserStatus.ACTIVE,
    type: UserType.SUB_ADMIN,
    phone: '123456789',
    subAdminId: '',
  },
];
export const manageUserMocks = [
  {
    id: '2',
    username: 'test2',
    email: 'test2@test.test',
    status: UserStatus.ACTIVE,
    type: UserType.AGENT,
    phone: '123456789',
    subAdminId: subAdminUsersMock[0]!.id,
    password: '',
  },
  {
    id: '1',
    username: 'test1',
    email: 'test1@test.test',
    status: UserStatus.ACTIVE,
    type: UserType.SUB_ADMIN,
    phone: '123456789',
    subAdminId: '',
    password: '',
  },
  {
    id: '3',
    username: 'test3',
    email: 'test3@test.test',
    status: UserStatus.ACTIVE,
    type: UserType.AGENT,
    phone: '123456789',
    subAdminId: subAdminUsersMock[1]!.id,
    password: '',
  },
  {
    id: '4',
    username: 'test4',
    email: 'test4@test.test',
    status: UserStatus.INACTIVE,
    type: UserType.AGENT,
    phone: '123456789',
    subAdminId: subAdminUsersMock[0]!.id,
    password: '',
  },
  {
    id: '5',
    username: 'test5',
    email: 'test5@test.test',
    status: UserStatus.ACTIVE,
    type: UserType.AGENT,
    phone: '123456789',
    subAdminId: subAdminUsersMock[1]!.id,
    password: '',
  },
  {
    id: '6',
    username: 'test6',
    email: 'test6@test.test',
    status: UserStatus.ACTIVE,
    type: UserType.AGENT,
    phone: '123456789',
    subAdminId: subAdminUsersMock[1]!.id,
    password: '',
  },
  {
    id: '7',
    username: 'test7',
    email: 'test7@test.test',
    status: UserStatus.ACTIVE,
    type: UserType.AGENT,
    phone: '123456789',
    subAdminId: subAdminUsersMock[1]!.id,
    password: '',
  },
];

export const newUserMock = {
  id: NEW_USER_ID,
  username: '',
  email: '',
  status: UserStatus.INACTIVE,
  type: UserType.AGENT,
  phone: '',
  subAdminId: '',
};
