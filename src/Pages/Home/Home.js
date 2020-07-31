import React, { useState, useEffect } from 'react'
import api from '../../Services/Api'

import Navbar from '../../Components/Navbar/Navbar'
import Card from '../../Components/Card/Card'
import Modal from '../../Components/Modal/Modal'

function Home() {
    const [isModalOpen, setModalOpen] = useState(false)

    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)

    const [productsData, setProductsData] = useState([])

    const [productsByName, setProductsByName] = useState('')
    const [productsByMaxPrice, setProducsByMaxPrice] = useState(100)

    const [filteredProductsData, setFilteredProductsData] = useState([])

    useEffect(() => {
        getUserLocation()
    }, [])

    async function getUserLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords
            setLatitude(latitude)
            setLongitude(longitude)
        }, (err) => {
            console.log(err)
        }, { timeout: 10000 })
    }

    useEffect(() => {
        getNearByProducts()
    }, [latitude, longitude])

    async function getNearByProducts() {
        try {
            const nearByProducts = await api.get(`/product?latitude=${latitude}&longitude=${longitude}`)
            const { data } = nearByProducts
            setProductsData(data)
        } catch(err) {
            alert('Erro ao carregar produtos')
        }
    }

    useEffect(() => {
        getFilteredProducts()
    }, [productsData, productsByName, productsByMaxPrice])

    function getFilteredProducts() {        
        const filteredProducts = productsData.filter(product =>
            (!productsByName || product.name.toLowerCase().includes(productsByName.toLowerCase())) &&
            (!productsByMaxPrice || product.price <= productsByMaxPrice)     
        )
        setFilteredProductsData(filteredProducts)
    }

    function openModal() {
        setModalOpen(true)
    }

    function closeModal() {
        setModalOpen(false)
    }

    return (
        <>
            <Navbar openModal={openModal} />
            <section className="input-section">
                <form>
                    <h1>Pesquisar produtos</h1>                    
                    <div className="form-inputs">
                        <input 
                            type="text" 
                            placeholder="pesquisar por nome"
                            value={productsByName}
                            onChange={e => setProductsByName(e.target.value)}
                        />
                        <input 
                            type="number" 
                            min="0" 
                            placeholder="preço máximo"
                            value={productsByMaxPrice}
                            onChange={e => setProducsByMaxPrice(e.target.value)}
                        />
                    </div>                    
                </form>
            </section>
            <section className="products-section">
                <div className="products-container">
                    {productsData.length > 0 ? 
                    (filteredProductsData.map(product => (
                        <Card key={product._id}
                            name={product.name}
                            price={product.price}
                            userName={product.user.name}
                            userWhats={product.user.whatsapp}                        
                        />
                    ))) : 
                        <h1>Carregando...</h1>
                    }                                                                      
                </div>                
            </section>

            {isModalOpen ? <Modal closeModal={closeModal} /> : null}            
        </>
    )
}

export default Home
