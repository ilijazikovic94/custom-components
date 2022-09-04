import { Button } from '@material-ui/core';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { ComparablesTable, ComparableUpdate, SelectOptions } from './ComparablesTable';
import { CreationModal } from './CreationModal';
import { useAppSelector } from './hooks';
import { Loader } from './Loader';
import { Login } from './Login';
import { LogoutButton } from './LogoutButton';
import './ManagerPage.css';
import { getComparables, updateComparables } from './networkCalls';
import { groupUpdates, mapMySqlSchemaToAppSchema } from './utils';

const ManagerPage = () => {
    const [comparables, setComparables] = useState([])
    const [schema, setSchema] = useState({})
    const [editableFields, setEditableFields] = useState<Array<string>>([])
    const [options, setOptions] = useState<SelectOptions>({})
    const [modalThatIsOpen, setOpenModal] = useState('')
    const loaderIsShown = useAppSelector(state => state.loader.isShown)

    const refreshComparables = async () => {
        const {comparables, schema, editableFields, options} = await getComparables()
        setComparables(comparables)
        setSchema(mapMySqlSchemaToAppSchema(schema))
        setEditableFields(editableFields)
        setOptions(options)
    }

    useEffect(() => {refreshComparables()}, [])

    const handleComparableCreation = async () => {
        setOpenModal('')
        await refreshComparables()
    }

    const handleComparablesUpdate = async (updates: Array<ComparableUpdate>) => {
        await updateComparables(groupUpdates(updates))
        await refreshComparables()
    }

    const token = localStorage.getItem('token')
    if (_.isNil(token) || token === '') {
        return <Login />
    }

    return (
        <div className="ManagerPage ag-theme-alpine">
            <div>
                <h1 style={{textAlign: 'center'}}>Comparables Manager</h1>
                <LogoutButton />
            </div>
            <Loader isShown={loaderIsShown} />
            <Button onClick={() => setOpenModal('creationModal')}>
                Add New Comparable
            </Button>
            <ComparablesTable
                comparables={comparables}
                schema={schema}
                editableFields={editableFields}
                handleUpdate={handleComparablesUpdate}
                options={options}
            />
            <CreationModal
                open={modalThatIsOpen === 'creationModal'}
                onClose={() => setOpenModal('')}
                schema={schema}
                editableFields={editableFields}
                options={options}
                onSubmit={handleComparableCreation}
            />
        </div>
    );
};
    
export default ManagerPage;