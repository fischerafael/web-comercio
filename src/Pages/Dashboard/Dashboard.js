import React, { useState, useContext, useEffect } from 'react'
import api from '../../Services/Api'

import { UserContext } from '../../Context/UserContext' 

import Navbar from '../../Components/Navbar/Navbar'
import DeletableCard from '../../Components/DeletableCard/DeletableCard'

function Dashboard() {
    const [userData, setUserData] = useContext(UserContext)

    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState(0)

    const [productsData, setProductsData] = useState([])

    useEffect(()=>{
        getUsersProducts()
    },[productsData])

    async function newProductHandler(e) {
        e.preventDefault()
        try {
            await api.post(`${userData._id}/product`, {
               name: productName,
               price: productPrice 
            }, {
                headers: {
                    auth: userData._id
                }
            })
            alert('Producto cadastrado com sucesso!')
            setProductName('')
            setProductPrice('')
        } catch(err) {
            alert('Falha ao adicionar produto, tente novamente')
        }
    }

    async function getUsersProducts() {
        try {
            const userProductsData = await api.get(`/product/${userData._id}`, {
                headers: {
                    auth: userData._id
                }
            })
            const { data } = userProductsData        
            setProductsData(data)
        } catch(err) {
            alert('Erro ao carregar produtos')
        }        
    }

    async function deleteProductHandler(product_id) {
        try {
            await api.delete(`/${userData._id}/product/${product_id}`, {
                headers: {
                    auth: userData._id
                }
            })
            alert('Produto removido com sucesso!')            
        } catch(err) {
            alert('Erro ao deletar produto')
        } 
    }

    return (
        <>
            <Navbar />
            <section className="input-section">
                <form>
                    <h1>Cadastrar Produtos</h1>
                    <div className="product-inputs">
                        <input 
                            type="text" 
                            placeholder="Nome do produto"
                            value={productName}
                            onChange={e=>setProductName(e.target.value)}
                        />
                        <input 
                            type="number" 
                            min="0" 
                            placeholder="Preço do produto (R$)"
                            max="1000"
                            value={productPrice}
                            onChange={e=>setProductPrice(e.target.value)}
                        />
                        <button onClick={newProductHandler}>Adicionar Produto</button>
                    </div>                    
                </form>
            </section>
            <section className="products-section">
                <div className="products-container">
                    {productsData.map(product => (
                        <DeletableCard key={product._id}
                            name={product.name}
                            price={product.price}
                            userName={product.user.name}
                            userWhats={product.user.whatsapp}
                            deleteProductHandler={()=>{deleteProductHandler(product._id)}}
                        />
                    ))}                    
                </div>                
            </section>

        </>
    )
}

export default Dashboard
