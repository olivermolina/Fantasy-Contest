import { AppSettingName } from '@prisma/client';

export const mockBanner = {
  id: 'test',
  text: 'LockSpread will match your first deposit up to $200!',
  priority: 1,
  created_at: new Date(),
  updated_at: new Date(),
  appSettingId: 'test',
  appSetting: {
    id: 'test',
    name: AppSettingName.MAX_MATCH_DEPOSIT_AMOUNT,
    value: '50',
  },
};
