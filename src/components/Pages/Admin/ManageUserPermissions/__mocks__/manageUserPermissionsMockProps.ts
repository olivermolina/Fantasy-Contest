import { UserStatus } from '@prisma/client';

export const manageUserPermissionsMockProps = {
  subAdmin: {
    id: '1',
    username: 'Employee 1',
    status: UserStatus.ACTIVE,
  },
  agents: [
    {
      id: '1',
      username: 'agent1',
      status: UserStatus.ACTIVE,
    },
    {
      id: '2',
      username: 'agent2',
      status: UserStatus.ACTIVE,
    },
    {
      id: '3',
      username: 'agent3',
      status: UserStatus.INACTIVE,
    },
    {
      id: '4',
      username: 'agent4',
      status: UserStatus.INACTIVE,
    },
  ],
  handleOpenManagePermission: () => console.log('handleOpenManagePermission'),
};
