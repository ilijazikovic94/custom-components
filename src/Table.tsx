import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

interface TableProps extends AgGridReactProps{
  children: JSX.Element | JSX.Element[],
}

export const Table: React.FC<TableProps> = ({children, ...props}) => {
  return (
    <div className="ag-theme-alpine" style={{height: "800px", width: '100%'}}>
      <AgGridReact {...props}>
        {children}
      </AgGridReact>
    </div>
  )
}
