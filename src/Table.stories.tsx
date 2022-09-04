import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Table } from './Table';
import { AgGridColumn } from 'ag-grid-react/lib/shared/agGridColumn';

export default {
  title: 'Table',
  component: Table,
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) =>
  <Table rowData = {[{name: 'Alex'}, {name: 'Susan'}]}>
    <AgGridColumn field = 'name' />
  </Table>

export const Basic = Template.bind({});
Basic.args = {}