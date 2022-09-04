import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AgGridColumn } from 'ag-grid-react';
import { CellAutocomplete } from './CellAutocomplete';
import { CellMultiselectViewer } from './CellMultiselectViewer';
import { Table } from './Table';
export default {
  title: 'CellAutocomplete',
  component: CellAutocomplete,
} as ComponentMeta<typeof CellAutocomplete>;

const options = [
  {label: "Option 1", value: 1},
  {label: "Option 2", value: 2},
  {label: "Option 3", value: 3},
]

const data = [
  {selectedOptions: [1,2]},
  {selectedOptions: [2]},
  {selectedOptions: [3]},
]

const Template: ComponentStory<typeof CellAutocomplete> = (args) => {
  return (
    <Table
      rowData={data}
      frameworkComponents = {{
        autocompleteEditor: CellAutocomplete,
        autocompleteViewer: CellMultiselectViewer,
      }}
    >
      <AgGridColumn
        field="selectedOptions"
        cellRenderer='autocompleteViewer'
        cellRendererParams={{options}}
        cellEditor='autocompleteEditor'
        cellEditorParams={{options}}
        editable={true}
        sortable={true}
        resizable={true}
        cellStyle={{ overflow: 'visible' }}
      />
    </Table>
  )
}
  

export const Basic = Template.bind({});
Basic.args = {}