import React, { useState, useContext, useEffect } from 'react'
import api from '../../Services/Api'

import { UserContext } from '../../Context/UserContext' 

import Navbar from '../../Components/Navbar/Navbar'
import DeletableCard from '../../Components/DeletableCard/DeletableCard'

import AddProduct from '../../assets/add-product.svg'

function Dashboard() {
    const [userData] = useContext(UserContext)

    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState(0)

    const [productsData, setProductsData] = useState([])

    console.log(productsData)

    useEffect(()=>{
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
        getUsersProducts()
    },[productsData, userData._id])

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
                        <div className="input">   
                            <label htmlFor="product-name">
                                Nome do Produto
                            </label>
                            <input 
                                id="product-name"
                                type="text"                             
                                value={productName}
                                onChange={e=>setProductName(e.target.value)}
                            />
                        </div>
                        <div className="input">
                            <label htmlFor="product-name">
                                Preço do Produto (em R$)
                            </label>
                            <input 
                                type="number" 
                                id="product-price"
                                min="0"                             
                                max="1000"
                                value={productPrice}
                                onChange={e=>setProductPrice(e.target.value)}
                            />
                        </div>                        
                        <button className="btn-add-product" onClick={newProductHandler}>Adicionar Produto</button>
                    </div>                    
                </form>
            </section>
            <section className="products-section">
                <div className="products-container">
                    {productsData.length !== 0 ?
                        productsData.map(product => (
                        <DeletableCard key={product._id}
                            name={product.name}
                            price={product.price}
                            userName={product.user.name}
                            userWhats={product.user.whatsapp}
                            deleteProductHandler={()=>{deleteProductHandler(product._id)}}
                        />
                    )) :
                        <>                            
                            <img src={AddProduct} alt="Adicione um produto" />
                            <div className="null-product-warnning">
                                <h1>Você ainda não está vendendo nenhum produto.</h1>
                                <h2>Cadastre algum produto e seja encontrado por seus vizinhos.</h2>
                            </div>                            
                        </>
                    }                    
                </div>                
            </section>

        </>
    )
}

export default Dashboard
