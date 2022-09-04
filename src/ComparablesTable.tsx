import { Button } from '@material-ui/core';
import { AgGridColumn } from 'ag-grid-react';
import _ from 'lodash';
import React from 'react';
import { DropdownOptions } from './Autocomplete';
import { CellAutocomplete } from './CellAutocomplete';
import { CellMultiselectViewer } from './CellMultiselectViewer';
import { deleteComparable, uploadLotFile, getLotFiles, getFile, deleteLotFile } from './networkCalls';
import { Table } from './Table';
import { Entity, fieldEntities, fieldNames, checkForMatches, GenericObject, Identifier, multiSelectFields, Primitive } from './utils';
import { ComparablesActionButtons } from './ComparablesActionButtons';
import { FileManagerModal } from './FileManagerModal';
import moment from 'moment';

export interface SelectOptions {
  [key: string]: DropdownOptions,
}
interface ComparablesTableProps {
  comparables: Array<GenericObject>,
  schema: {[key: string]: string},
  editableFields: Array<string>,
  options: SelectOptions,
  handleUpdate: (updates: Array<ComparableUpdate>) => Promise<void>,
}
export interface ComparableUpdate {
  inscriptionNumber: string,
  field: string,
  value: Primitive | Primitive[],
}
export interface ComparableFieldUpdate extends ComparableUpdate {
  value: Primitive
}

export interface ComparableRelationUpdate extends ComparableUpdate {
  value: Primitive[]
}

export const ComparablesTable: React.FC<ComparablesTableProps> =
  ({comparables, schema, editableFields, options, handleUpdate}) => {
    schema = {...schema, ..._(multiSelectFields).keyBy(f => f).mapValues(() => 'multiselect').value()}
    const [updates, setUpdates] = React.useState<Array<ComparableUpdate>>([])
    const [fileManagerLotNumbers, setFileManagerLotNumbers] = React.useState<string[] | null>(null);
  
    const addCellUpdate = ({inscriptionNumber, field, value}: ComparableUpdate) => {
      const newUpdates = [...updates, {inscriptionNumber, field, value}]
      setUpdates(newUpdates)
    }

    const handleCellValueChange = (e: any) => {
      let value = e.newValue
      if (e.column.getColId() === 'lotNumbers') {
        const scrapedLotNumbers = e.node?.data._scrapedLotNumbers
        if (scrapedLotNumbers) {
          value = value.filter((lotNumber: Identifier) =>
            !scrapedLotNumbers.includes(lotNumber)
          )
        }
      }

      addCellUpdate({
        inscriptionNumber: e.node?.data.inscriptionNumber,
        field: e.column.getColId(),
        value,
      })
    }

    const handleSaveClick = async () => {
      await handleUpdate(updates)
      setUpdates([])
    }

    const handleDeleteClick = async (inscriptionNumber: string) => {
      await deleteComparable(inscriptionNumber)
      window.location.reload()
    }

    const onManageFilesClick = (lotNumbers: string[]) => {
      setFileManagerLotNumbers(lotNumbers);
    }

    const frameworkComponents = {
      actions: ComparablesActionButtons,
      autocompleteViewer: CellMultiselectViewer,
      autocompleteEditor: CellAutocomplete,
    }

    const renderColumn = (field: string, index: number) => {
      const cellParams = {
        options: options[fieldEntities[field]],
        allowOptionCreation: fieldEntities[field] === Entity.Lot,
        disabledOptionsField: fieldEntities[field] === Entity.Lot ? '_scrapedLotNumbers' : '',
      }

      let filterParams = {};

      switch (schema[field]) {
        case 'date': {
          filterParams = {
            comparator: (filter: Date, cellValue: string) => {
              // comparison without time
              const filterStartOfDay = moment(filter).startOf('day');
              const cellValueStartOfDay = moment(cellValue).startOf('day');
              if (filterStartOfDay < cellValueStartOfDay) {
                return 1;
              } else if (filterStartOfDay > moment(cellValue)) {
                return -1;
              }
              return 0;
            },
          };
          break;
        }
        case 'text': {
          filterParams = {
            filterOptions: ['contains', 'notContains'],
            textCustomComparator: (filter: string, value: string, filterValue: string) => {
              return checkForMatches({filter: filter, value: value, filterValue: filterValue});
            },
            debounceMs: 200,
            suppressAndOrCondition: true,
          };
          break;
        }
      }

      return (
        <AgGridColumn
          headerName={_.get(fieldNames, field, _.startCase(field))}
          key={field}
          field={field}
          cellRenderer={schema[field] === 'multiselect' ? 'autocompleteViewer' : undefined}
          cellRendererParams={cellParams}
          cellEditor={schema[field] === 'multiselect' ? 'autocompleteEditor' : undefined}
          cellEditorParams={cellParams}
          onCellValueChanged={handleCellValueChange}
          filter={`ag${_.startCase(schema[field])}ColumnFilter`}
          filterParams={filterParams}
          editable={_(editableFields).includes(field) || schema[field] === 'multiselect'}
          resizable={true}
          sortable={true}
          cellStyle={{backgroundColor: index % 2 ? '#F0F0F0' : '#F8F8F8'}}
        />
      )
    }

    return (
      <div>
        <Table
          rowData={comparables}
          pagination={true}
          paginationAutoPageSize={true}
          frameworkComponents = {frameworkComponents}
        >
          {
            comparables.length > 0 ?
              _(schema)
                .keys()
                .filter(key => !key.startsWith('_'))
                .map(renderColumn)
                .concat(
                  <div key='actions'>
                    {comparables.length > 0 ?
                      <AgGridColumn 
                        field='Actions'
                        cellRenderer='actions'
                        cellRendererParams={{onDelete: handleDeleteClick, onManageFiles: onManageFilesClick}}
                      />
                    :
                      <></>
                    }  
                  </div>
                ).value()
            :
              <></>
          }
        </Table>
        <FileManagerModal 
          open={fileManagerLotNumbers !== null}
          uploadLotFile={uploadLotFile}
          getFile={getFile}
          getLotFiles={getLotFiles}
          deleteLotFile={deleteLotFile}
          lotNumbers={fileManagerLotNumbers}
          onClose={() => setFileManagerLotNumbers(null)}
        />
        <Button
          disabled={updates.length === 0}
          onClick={handleSaveClick}
        >
          Save Updates
        </Button>
      </div>
    );
  };
