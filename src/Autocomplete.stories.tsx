import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Autocomplete } from './Autocomplete';
import { options } from './storyConstants';

export default {
  title: 'Autocomplete',
  component: Autocomplete,
} as ComponentMeta<typeof Autocomplete>;

const Template: ComponentStory<typeof Autocomplete> = (args) => <Autocomplete {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  selectedValues: [options.buyer[0].value],
  options: options.buyer,
  allowOptionCreation: true,
  disabledOptions: [options.buyer[0].value],
  onChange: () => {},
};