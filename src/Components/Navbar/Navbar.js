import React, { useContext } from 'react'

import { UserContext } from '../../Context/UserContext' 

import Logo from '../../assets/logo-comercio-local.png'

function Navbar({ openModal }) {
    const [userData, setUserData] = useContext(UserContext)

    async function logoutHandler(e) {
        e.preventDefault()

        setUserData(prevState => ({
            ...prevState, 
            isLogged: false,
            email: '',
            name: '', 
            _id: '',           
        }))
    }

    return (
        <nav>
            <div className="nav-container">
                <img src={Logo} alt="Logo do comércio local"/>               
                {userData.isLogged ?
                    <>
                    <p>Olá, {userData.name}</p>
                    <button onClick={logoutHandler}>SAIR</button>
                    </> : 
                    <button onClick={openModal}>VENDER</button>}                
            </div>
        </nav>
    )
}

export default Navbar
