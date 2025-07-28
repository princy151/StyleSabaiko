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
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="order-container">
      <h2 className="order-title">Order Details</h2>
      <div className="order-content">
        {/* Summary Box */}
        <div className="order-summary">
          <h3>Summary</h3>
          <div className="summary-row">
            <span>Order ID:</span>
            <span>{order.orderId}</span>
          </div>
          <div className="summary-row">
            <span>Order Date:</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="summary-row">
            <span>Total:</span>
            <span>Rs. {order.grandTotal}</span>
          </div>
          <div className="summary-row">
            <span>Name:</span>
            <span>{order.receiverName}</span>
          </div>
          <div className="summary-row">
            <span>Email:</span>
            <span>{order.receiverEmail}</span>
          </div>
          <div className="summary-row">
            <span>Phone:</span>
            <span>{order.receiverPhone}</span>
          </div>
          <div className="summary-row">
            <span>Address:</span>
            <span>{order.receiverAddress}</span>
          </div>
        </div>

        {/* Items Box */}
        <div className="order-items">
          <h3>Items</h3>
          {order?.products?.map((item) => (
            <div key={item.id} className="item-card">
              <img
                src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${item.product.imageUrl}`}
                alt={item.product.title}
              />
              <div className="item-info">
                <p className="item-title">{item.product.title}</p>
                <p className="item-meta">Quantity: {item.quantity}</p>
                <p className="item-meta">Price: Rs. {item.product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
