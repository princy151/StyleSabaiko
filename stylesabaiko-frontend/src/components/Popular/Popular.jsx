import React, { useEffect, useState } from 'react';
import './Popular.css';
import { getPopularProductsApi } from '../../apis/Api';
import Item from '../Item/Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

useEffect(() => {
  getPopularProductsApi()
    .then((res) => {
      const sorted = res.data.products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPopularProducts(sorted);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);

  return (
    <section className="popular">
      <div className="popular-header">
        <h1>FEATURED PRODUCTS</h1>
        <div className="underline"></div>
      </div>

      <div className="popular-list" role="list">
        {popularProducts.slice(0, 4).map((item, i) => (
          <Item
            key={i}
            id={item._id}
            name={item.title}
            image={item.imageUrl}
            price={item.price}
            description={item.description}
            category={item.category}
          />
        ))}
      </div>
    </section>
  );
};

export default Popular;
