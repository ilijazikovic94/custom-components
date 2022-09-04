import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CreationModal } from './CreationModal';
import { DataType } from './utils';
import { options } from './storyConstants';

export default {
  title: 'CreationModal',
  component: CreationModal,
} as ComponentMeta<typeof CreationModal>;

const Template: ComponentStory<typeof CreationModal> = (args) => <CreationModal {...args} />;

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
  open: true,
}