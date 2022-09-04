import { Button, TextField } from "@material-ui/core";
import _ from 'lodash';
import React, { useState } from 'react';
import { Autocomplete } from './Autocomplete';
import { SelectOptions } from "./ComparablesTable";
import { insertComparable } from './networkCalls';
import { convertFormDataToUpdates, DataType, Entity, fieldEntities, fieldHints, fieldNames, GenericObject, groupUpdates, isFormDataSubmittable, multiSelectFields, reorderSchema, Schema, requiredFields } from './utils';

export interface CreationFormProps {
  schema: Schema,
  editableFields: Array<string>,
  options: SelectOptions,
  onSubmit: () => void,
}

export const CreationForm: React.FC<CreationFormProps> = ({schema, editableFields, options, onSubmit}) => {

  const [formData, setFormData] = useState<GenericObject>({})

  const handleSubmit = async (event: SubmitEvent) => {
    try {
      const updates = convertFormDataToUpdates(formData)
      const groupedUpdates = groupUpdates(updates)
      await insertComparable(groupedUpdates[0])
      onSubmit()
    } catch (e) {
      alert("Creation failed! It's possible that a comparable already has this inscription number.")
    }
  }

  const ordering = [
    "inscriptionNumber",
    "lotNumbers",
    "transactionValue",
  ]

  const orderedSchema = reorderSchema({
    schema: {
      inscriptionNumber: DataType.Text,
      ..._.pick(schema, editableFields),
      ..._(multiSelectFields).keyBy(v => v).mapValues(() => 'multiselect').value(),
    },
    ordering,
  })

  return (
    <div>
        <h1>Create Comparable</h1>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {
            _(orderedSchema).map((v, field) =>
              <div key={field} style={{padding: 10}}>
                {
                  multiSelectFields.includes(field) ?
                    <div>
                      <h4>{fieldNames[field]}</h4>
                      <Autocomplete
                        selectedValues={formData[field]}
                        options={options[fieldEntities[field]]}
                        allowOptionCreation={fieldEntities[field] === Entity.Lot}
                        onChange={selectedValues => setFormData({...formData, [field]: selectedValues})}
                      />
                    </div>
                  :
                    <TextField
                      type="text"
                      label={_.startCase(field)}
                      variant="outlined"
                      value={formData[field] || ''}
                      onChange={e => setFormData({...formData, [field]: e.target.value})}
                    />
                }
                <div style={{padding: 5, fontSize: 14}}>
                  <div>{requiredFields.includes(field) ? '*Required field' : ''}</div>
                  <div>{_.get(fieldHints, field)}</div>
                </div>
              </div>
            ).value()
          }
          <Button
            variant="contained"
            onClick={handleSubmit as any}
            disabled={!isFormDataSubmittable(formData)}
          >
            Submit
          </Button>
        </div>
      </div>
  );
};