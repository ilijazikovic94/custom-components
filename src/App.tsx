import './App.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import _ from 'lodash'

import { Login } from './Login';
import ManagerPage from './ManagerPage';

const App = () => {
    const token = localStorage.getItem('token')
    if (_.isNil(token) || token === '') {
        return <Login />
    } else {
        return <ManagerPage />
    }
};
    
export default App;