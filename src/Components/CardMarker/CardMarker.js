import React from 'react'

function CardMarker({ name, price, userName, userWhats }) {   
    return (
        <div className="card-marker">                      
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

export default CardMarker