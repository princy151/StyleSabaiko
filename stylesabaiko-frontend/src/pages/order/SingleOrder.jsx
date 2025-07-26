import React, { useEffect, useState } from 'react';
import { getOrderApi } from '../../apis/Api';
import { useParams } from 'react-router-dom';
import "../CSS/SingleOrder.css";

const SingleOrder = () => {
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    getOrderApi(id)
      .then((res) => {
        setOrder(res.data.order);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="order-detail-container">
      <h1>Order Details</h1>
      <div className="order-info">
        <div className="order-id">
          <h3>Order ID:</h3>
          <p>{order.orderId}</p>
        </div>
        <div className="order-date">
          <h3>Order Date:</h3>
          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="order-total">
          <h3>Total Amount:</h3>
          <p>Rs. {order.grandTotal}</p>
        </div>
      </div>
      <h2>Shipping Address:</h2>
      <div className="shipping-address">
        <p><strong>Full Name:</strong> {order.receiverName}</p>
        <p><strong>Email:</strong> {order.receiverEmail}</p>
        <p><strong>Phone:</strong> {order.receiverPhone}</p>
        <p><strong>Address:</strong> {order.receiverAddress}</p>
      </div>
      <h2>Items:</h2>
      <div className="order-items">
        {order?.products?.map((item) => (
          <div key={item.id} className="order-item">
            <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${item.product.imageUrl}`} alt={item.product.title} />
            <div className="item-details">
              <h4>{item.product.title}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: Rs. {item.product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SingleOrder;
