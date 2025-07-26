import React from 'react'
import CategoryProduct from '../../components/CategoryProduct/CategoryProduct'

const ProductList = ({category}) => {
  return (
    <div>
      <CategoryProduct category={category} />
    </div>
  )
}

export default ProductList
