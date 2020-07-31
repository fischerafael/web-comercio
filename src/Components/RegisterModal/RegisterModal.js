import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../Services/Api'

function RegisterModal({ setLoginForm }) {
    const [name, setName] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)    

    useEffect(() => {
        getUserLocation()
    }, [])

    async function registrationHandler(e) {
        e.preventDefault()
        try {
            await api.post('user', {
                name,
                whatsapp,
                email,
                password,
                latitude,
                longitude               
            })
            alert('Cadastro realizado com sucesso! Você já pode acessar sua conta')  
            setName('')
            setWhatsapp('')
            setEmail('')
            setPassword('')
        } catch(err) {
            alert('Erro ao cadastrar usuário, tente novamente')
        }
    }

    async function getUserLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords
            setLatitude(latitude)
            setLongitude(longitude)
        }, (err) => {
            console.log(err)
        }, { timeout: 10000 })
    }

    return (
        <div className="modal">
            <h1>Cadastrar</h1>
            <form>
                <input 
                    type="text" 
                    placeholder="nome"
                    value={name}
                    onChange={e=>setName(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="whatsapp"
                    value={whatsapp}
                    onChange={e=>setWhatsapp(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="senha"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                />
                <button onClick={registrationHandler}>CADASTRAR</button>
                <Link onClick={setLoginForm}>Já tenho uma conta</Link>
            </form>
        </div>
    )
}

export default RegisterModal
