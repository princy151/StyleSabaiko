import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
  return (
    <div className='item-container'>
      <Link to={`/product/${props.id}`} className='item-link'>
        <img
          className='item-image'
          onClick={window.scrollTo(0, 0)}
          src={process.env['REACT_APP_BACKEND_IMAGE_URL'] + props.image}
          alt="products"
        />
      <div className="item-info">
        <h2 className="item-name">{props.name}</h2>
        <p className="item-price">Rs. {props.price.toFixed(2)}</p>
        <p className="item-category">{props.category}</p>
        <p className="item-description">{props.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default Item;
