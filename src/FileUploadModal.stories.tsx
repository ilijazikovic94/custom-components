import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FileUploadModal } from './FileUploadModal';
export default {
  title: 'FileUploadModal',
  component: FileUploadModal,
} as ComponentMeta<typeof FileUploadModal>;

const Template: ComponentStory<typeof FileUploadModal> = (args) => <FileUploadModal {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  open: true,
  lotNumber: '1111'
};
