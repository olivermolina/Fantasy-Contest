import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import GetVerifiedDialogComponent from './GetVerifiedDialog';
import { Button } from '@mui/material';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: GetVerifiedDialogComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof GetVerifiedDialogComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GetVerifiedDialogComponent> = (args) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open Get Verified Dialog
      </Button>

      <GetVerifiedDialogComponent
        {...args}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </div>
  );
};

export const GetVerified = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
GetVerified.args = {};
