import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ComparablesActionButtons } from './ComparablesActionButtons';

export default {
  title: 'Actions',
  component: ComparablesActionButtons,
} as ComponentMeta<typeof ComparablesActionButtons>;

const Template: ComponentStory<typeof ComparablesActionButtons> = (args) => <ComparablesActionButtons {...args} />;

const onDelete = (inscriptionNumber: string) => alert(`Deleting '${inscriptionNumber}'!`);
const onManageFiles = (lotNumbers: number[]) => alert(`Managing files of lots '${lotNumbers.join(', ')}'!`);

const data = { inscriptionNumber: '1234', lotNumbers: [1111, 2222] };
export const ManuallyAdded = Template.bind({});
ManuallyAdded.args = {
  data: { ...data, source: 'MANUALLY_ADDED' },
  onDelete,
  onManageFiles,
};

export const NotManuallyAdded = Template.bind({});
NotManuallyAdded.args = {
  data: { ...data, source: 'SCRAPED' },
  onDelete,
  onManageFiles,
};
