import { ComponentMeta, ComponentStory } from '@storybook/react';
import HowToPlayComponent from './HowToPlay';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Challenge',
  component: HowToPlayComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof HowToPlayComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof HowToPlayComponent> = (args) => (
  <HowToPlayComponent {...args} />
);

export const HowToPlayDialog = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HowToPlayDialog.args = {
  handleClose: () => console.log('handleClose'),
};
