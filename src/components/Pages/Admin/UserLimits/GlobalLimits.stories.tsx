import type { Meta } from '@storybook/react';

import GlobalLimitsComponent from './GlobalLimits';

const meta: Meta<typeof GlobalLimitsComponent> = {
  title: 'Lockspread/Admin/GlobalLimits',
  component: GlobalLimitsComponent,
  args: {
    defaultValues: {
      min: 1,
      maxDailyTotalBetAmount: 100,
      max: 100,
      repeatEntries: 1,
    },
    onSubmit: () => console.log('onSubmit'),
  },
};
export default meta;
