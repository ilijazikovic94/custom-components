import { forwardRef, useImperativeHandle, useState } from "react";
import { Autocomplete, SharedAutocompleteProps } from "./Autocomplete";
import { GenericObject, Identifier } from "./utils";

export interface CellAutocompleteProps extends SharedAutocompleteProps {
  value: Array<Identifier>,
  disabledOptionsField: string,
  data: GenericObject,
}

export const CellAutocomplete = forwardRef<any, CellAutocompleteProps>(
  ({options, value: initialSelectedValues, allowOptionCreation, disabledOptionsField, data}, ref) => {
    const [selectedValues, setSelectedValues] = useState<Identifier[]>(initialSelectedValues)

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return selectedValues
        },
        
        isPopup() {
          return true
        },
      };
    });

    const handleChange = (selectedValues: Identifier[]) => {
      setSelectedValues(selectedValues)
    }

    const style = {
      background: '#e6e6e6',
      padding: '10px',
      display: 'inline-block',
      outline: 'none',
      width: '100%',
      minWidth: 150,
    }

    return (
      <div style={style}>
        <Autocomplete
          selectedValues={selectedValues}
          options={options}
          allowOptionCreation={allowOptionCreation}
          disabledOptions={data[disabledOptionsField]}
          onChange={handleChange}
        />
      </div>
    )
  }
)