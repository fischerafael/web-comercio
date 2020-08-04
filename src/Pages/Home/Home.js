import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'

import api from '../../Services/Api'

import Navbar from '../../Components/Navbar/Navbar'
import Card from '../../Components/Card/Card'
import Modal from '../../Components/Modal/Modal'
import CardMarker from '../../Components/CardMarker/CardMarker'

function Home() {
    const [isModalOpen, setModalOpen] = useState(false)

    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)

    const [productsData, setProductsData] = useState([])

    const [productsByName, setProductsByName] = useState('')
    const [productsByMaxPrice, setProducsByMaxPrice] = useState(100)

    const [filteredProductsData, setFilteredProductsData] = useState([])

    const [viewport, setViewport] = useState({
        latitude: 0,
        longitude: 0,
        width: "100vw",
        height: "45vh",
        zoom: 15
    })

    const [selectedProduct, setSelectedProduct] = useState(null)

    const [isList, setIslist] = useState(true)

    const mapboxApiToken = "pk.eyJ1IjoiZGVzaWduZmlzY2hlciIsImEiOiJja2RldnlqMmwwYXUyMzBwZnlrYmhwYjA5In0.qYk2QofNKKecizVF99V8ew"

    useEffect(() => {
        getUserLocation()
    }, [])

    async function getUserLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords
            setLatitude(latitude)
            setLongitude(longitude)
            setViewport({...viewport, latitude, longitude})
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
            console.log(data)
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

    function loadList(e) {
        e.preventDefault()
        setIslist(true)
    }

    function loadMap(e) {
        e.preventDefault()
        setIslist(false)
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
                    {isList ? <button onClick={loadMap}>Ver mapa</button> : <button onClick={loadList}>Ver lista</button>}                                        
                </form>
            </section>

            {isList ?
                (<section className="products-section">
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
                </section>) :
                (<section className="products-map-section">
                <ReactMapGL 
                    {...viewport}
                    mapboxApiAccessToken={mapboxApiToken}
                    onViewportChange={viewport => {
                        setViewport(viewport)
                    }}
                >
                    {filteredProductsData.map(product => (
                        <Marker
                            key={product._id}
                            latitude={product.location.coordinates[1]}
                            longitude={product.location.coordinates[0]}
                        >
                            <div className="marker">
                                <button 
                                    className="marker-btn"
                                    onClick={e => {
                                        e.preventDefault()
                                        setSelectedProduct(product)
                                    }}
                                >
                                   <h1>{product.name}</h1> 
                                </button>
                            </div>
                        </Marker>
                    ))}  

                    {selectedProduct ? (
                        <Popup
                            latitude={selectedProduct.location.coordinates[1]}
                            longitude={selectedProduct.location.coordinates[0]}
                            onClose={() => {
                                setSelectedProduct(null)
                            }}
                        >
                            <CardMarker 
                                name={selectedProduct.name}
                                price={selectedProduct.price}
                                userName={selectedProduct.user.name}
                                userWhats={selectedProduct.user.whatsapp}                        
                            />
                        </Popup>
                    )
                        : null
                    }
                </ReactMapGL>
            </section>)
            }          
            {isModalOpen ? <Modal closeModal={closeModal} /> : null}            
        </>
    )
}

export default Home
