import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { ComparablesTable } from '../ComparablesTable';
import { options } from '../storyConstants';


export default {
  title: 'ComparablesTable',
  component: ComparablesTable,
} as ComponentMeta<typeof ComparablesTable>;

const Template: ComponentStory<typeof ComparablesTable> = (args) => <ComparablesTable {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  comparables: [
    {
      date: '2022-02-06T15:59:54.193Z',
      inscriptionNumber: '1234',
      squareFeet: 5000,
      buildableUnits: 4,
      buyerIds: [12,13],
      source: 'MANUALLY_ADDED',
      lotNumbers: [1111],
      _scrapedLotNumbers: [1111],
    },
    {
      date: '2021-12-06T15:59:54.193Z',
      inscriptionNumber: '555666',
      squareFeet: 4500,
      buildableUnits: 3,
      buyerIds: [12, 13, 14],
    },
    {
      date: '2022-01-06T15:59:54.193Z',
      inscriptionNumber: '9768',
      squareFeet: 3500,
      buildableUnits: 2,
      source: 'MANUALLY_ADDED',
      buyerIds: [12],
    },
  ],
  schema: {
    date: 'date',
    inscriptionNumber: 'text',
    squareFeet: 'number',
  },
  options,
  editableFields: ["squareFeet", "buildableUnits"],
  handleUpdate: async updates => console.log(updates)
};