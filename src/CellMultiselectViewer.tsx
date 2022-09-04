import { forwardRef, useImperativeHandle } from "react";
import { CellAutocompleteProps } from "./CellAutocomplete";
import { Identifier } from "./utils";

export const CellMultiselectViewer = forwardRef<any, CellAutocompleteProps>(({options=[], value: selectedValues=[]}, ref) => {
  useImperativeHandle(ref, () => ({getValue: () => false}))
  const selectedOptionLabels =
    selectedValues?.length > 0 ?
      selectedValues.map((id: Identifier) => options.find(({value}) => value === id)?.label || id)
    :
      []
  return (
    <div>{selectedOptionLabels.join(', ')}</div>
  )
})