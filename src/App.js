import React from 'react';

import './Styles/main.scss'

import { UserProvider } from './Context/UserContext'
import Routes from './Routes/Routes'

function App() {
  return (
    <>
    <UserProvider>
      <Routes />
    </UserProvider>  
    </>  
  );
}

export default App;
