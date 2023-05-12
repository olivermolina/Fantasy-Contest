import { UserType } from '@prisma/client';

export const mapUserTypeLabel = (userType: UserType) => {
  switch (userType) {
    case UserType.ADMIN:
      return 'Admin';
    case UserType.PLAYER:
      return 'Player';
    case UserType.AGENT:
      return 'Partner';
    case UserType.SUB_ADMIN:
      return 'PAM';
    default:
      return 'Unknown';
  }
};
