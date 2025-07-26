import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import { getNewProductsApi } from '../../apis/Api'
import Item from '../Item/Item'

const NewCollections = () => {

  const [newProducts, setNewProducts] = useState([])

  
  useEffect(() => {
    getNewProductsApi().then((res) => {
      
      setNewProducts(res.data.products)

    }).catch((error) => {
      console.log(error)
    })
  }, [])

  console.log(newProducts)
  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newProducts.slice(0,8).map((item,i)=>{
          return <Item key={i} id={item._id} name={item.title} image={item.imageUrl} price={item.price} description={item.description} category={item.category} />
        })}
      </div>
    </div>
  )
}

export default NewCollections
