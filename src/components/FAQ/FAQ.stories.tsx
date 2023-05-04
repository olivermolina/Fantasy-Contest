import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FAQ } from './FAQ';

import { faqs } from './faq.items';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/FAQ',
  component: FAQ,
} as ComponentMeta<typeof FAQ>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FAQ> = (args) => <FAQ {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  faqs: faqs,
};
