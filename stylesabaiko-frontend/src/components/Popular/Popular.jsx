import React, { useEffect, useState } from 'react';
import './Popular.css';
import { getPopularProductsApi } from '../../apis/Api';
import Item from '../Item/Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    getPopularProductsApi()
      .then((res) => {
        setPopularProducts(res.data.products);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <section className="popular">
      <div className="popular-header">
        <h1>NEWLY ADDED</h1>
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
