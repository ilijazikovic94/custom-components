import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Loader } from './Loader';

export default {
  title: 'Loader',
  component: Loader,
} as ComponentMeta<typeof Loader>;

const Template: ComponentStory<typeof Loader> = (args) =>
  <div>
    Some text
    <Loader {...args} />
  </div>

export const Basic = Template.bind({});
Basic.args = {
 isShown: true, 
}