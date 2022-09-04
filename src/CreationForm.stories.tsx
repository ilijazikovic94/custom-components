import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { CreationForm } from './CreationForm';
import { options } from './storyConstants';
import { DataType } from './utils';

export default {
  title: 'CreationForm',
  component: CreationForm,
} as ComponentMeta<typeof CreationForm>;

const Template: ComponentStory<typeof CreationForm> = (args) => <CreationForm {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  schema: {
    inscriptionNumber: DataType.Text,
    transactionValue: DataType.Number,
  },
  editableFields: [
    "transactionValue",
  ],
  options,
  onSubmit: () => {},
};