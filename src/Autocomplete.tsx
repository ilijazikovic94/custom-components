import { Chip, TextField } from "@material-ui/core";
import { Autocomplete as AutocompleteMui } from "@mui/material";
import _, { isObject } from "lodash";
import { Identifier } from "./utils";

export type DropdownOptions = Array<{label: string | number, value: Identifier}>

export interface SharedAutocompleteProps {
  options: DropdownOptions,
  allowOptionCreation: boolean,
}
export interface AutocompleteProps extends SharedAutocompleteProps {
  selectedValues: Array<Identifier>,
  onChange: (selectedValues: Identifier[]) => void,
  disabledOptions?: Array<Identifier>,
}

export const Autocomplete: React.FC<AutocompleteProps> = ({selectedValues=[], options=[], allowOptionCreation, disabledOptions=[], onChange}) => {
  const selections =
    options
      .filter(({value}) => selectedValues?.includes(value))
      .concat(
        allowOptionCreation ?
          selectedValues
            .filter(value => !_.map(options, 'value').includes(value))
            .map(value => ({label: value, value: value as Identifier}))
        :
          []
      )

  const handleChange = (event: unknown, newSelections: any) => {
    const newSelectedValues =
      _(newSelections as DropdownOptions)
        .map(selection =>
          isObject(selection) ?
            selection.value
          :
            selection
        ).value()
        
    onChange(newSelectedValues)
  }

  return (
    <AutocompleteMui
      multiple={true}
      disableCloseOnSelect={true}
      disableClearable={true}
      freeSolo={allowOptionCreation}
      options={options}
      value={selections}
      size="small"
      renderInput={params =>
        <TextField
          {...params}
          variant="standard"
        />
      }
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) =>
          <Chip
            label={option.label}
            {...getTagProps({ index })}
            disabled={disabledOptions && disabledOptions.includes(option.value)}
          />
        )
      }

      onChange={handleChange}
    />
  )
}