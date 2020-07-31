import React from 'react'

function DeletableCard({ name, price, userName, userWhats, deleteProductHandler }) {   
    return (
        <div className="card">
            <button onClick={ deleteProductHandler }>Excluir</button>          
            <h2>{ name }</h2>
            <h1>R$ { price }</h1>
            <div className="card-info">
                <div className="card-info-detail">                                
                    <p>{ userName }</p>
                </div>
                <div className="card-info-detail">                                
                    <p>{ userWhats }</p> 
                </div>                                                    
            </div>
        </div>
    )
}

export default DeletableCard