import { AppSettingName } from '@prisma/client';

export const bannerMock = {
  id: '1',
  text: 'test',
  priority: 1,
  appSettingId: '1',
  appSetting: {
    id: '1',
    name: AppSettingName.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
    value: '1',
  },
};
