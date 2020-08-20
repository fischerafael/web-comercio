import React, { useContext } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import { UserContext } from '../Context/UserContext' 

import Home from '../Pages/Home/Home'
import Dashboard from '../Pages/Dashboard/Dashboard'

function Routes() {
    const [userData] = useContext(UserContext)    

    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact>
                    {userData.isLogged ?  <Redirect to="/dashboard" /> : <Home />}
                </Route>            
                <Route path='/dashboard'> 
                    {userData.isLogged ?  <Dashboard /> : <Redirect to="/" />}
                </Route>                                     
            </Switch>
        </BrowserRouter>
    )
}

export default Routes
