import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import CarsTable from './pages/Cars/CarsTable';
import CreateCar from './pages/Cars/CreateEditCar/CreateCar';
import PagableTable from './pages/Cars/PaginatableTable';


ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path='/login' component={ Login } />
            <Route path='/register' component={ Register } />
            <Route exact path='/' component={ PagableTable } />
            <Route path='/create' component={ CreateCar } />
            <Route path='/edit/:id' component={ CreateCar } />
        </Switch>
    </BrowserRouter>, document.getElementById('root'));

