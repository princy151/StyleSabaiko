import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import { getProductsByCategoryApi } from '../../apis/Api';

const RelatedProducts = ({ category, id }) => {

  const [relatedProducts, setRelated] = useState([]);

  useEffect(() => {
    getProductsByCategoryApi(category).then((res) => { setRelated(res.data.products) }).catch((err) => { })
  }, [category])
  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-products-list">
        {relatedProducts.filter(e => e._id !== id).slice(0, 4).map(product => (
          <div className="related-product-item" key={product.id}>
            <img
              className="related-product-image"
              src={process.env['REACT_APP_BACKEND_IMAGE_URL'] + product.imageUrl}
              alt={product.title}
            />
            <h3 className="related-product-title">{product.title}</h3>
            <div className="related-product-price">Rs. {product.price}</div>
            <a href={`/product/${product._id}`} className="related-product-link">View Product</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts
