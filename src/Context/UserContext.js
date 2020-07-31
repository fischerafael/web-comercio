import React, { createContext, useState } from 'react'

export const UserContext = createContext()

export function UserProvider(props) {
    const [userData, setUserData] = useState({
        isLogged: false,
        email: '',
        name: '',
        _id: '',
    })

    return (
        <UserContext.Provider value={[userData, setUserData]}>
            {props.children}
        </UserContext.Provider>
    )
}