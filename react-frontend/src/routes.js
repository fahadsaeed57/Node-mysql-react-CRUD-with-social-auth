/**
 * Created by fahad.saeed on 10/22/2018.
 */
import React from 'react';
import {BrowserRouter,  Route,  Switch} from 'react-router-dom';


import Home from '././components/Home/Home';
import Login from '././components/Login/Login';
import EmpDetails from '././components/EmpDetails/EmpDetails'


const Routes = () => (
    <BrowserRouter >
        <Switch>

            <Route path="/home" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/employee/:empId" component={EmpDetails} />
        </Switch>
    </BrowserRouter>
);

export default Routes;