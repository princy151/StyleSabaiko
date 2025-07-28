import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../CSS/Order.css";
import {
  createOrderApi,
  khaltiApi,
  removeItemsFromCartApi,
} from "../../apis/Api";
import { toast } from "react-toastify";
import { useCart } from "../../components/Context/CartContext";

const Order = () => {
  const location = useLocation();
  const { updateCartCount, removeItemsFromCart } = useCart();

  const { cartItems, quantities, subtotal } = location.state || {
    cartItems: [],
    quantities: {},
    subtotal: null,
  };

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [userQuantities, setUserQuantities] = useState(quantities);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleQuantityChange = (id, value) => {
    const qty = parseInt(value);
    if (qty >= 1) {
      setUserQuantities((prev) => ({
        ...prev,
        [id]: qty,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to place an order");
      return;
    }

    const products = cartItems.map((item) => ({
      identity: item._id,
      name: item.product.title,
      total_price: Math.round(item.product.price * 100),
      quantity: userQuantities[item._id] || 1,
      unit_price: Math.round(item.product.price * 100),
    }));

    const data = {
      products: cartItems.map((cartItem) => ({
        product: cartItem.product,
        quantity: userQuantities[cartItem._id] || 1,
      })),
      receiverName: userDetails.name,
      receiverAddress: userDetails.address,
      receiverPhone: userDetails.phone,
      receiverEmail: userDetails.email,
      grandTotal: subtotal,
    };

    try {
      const res = await createOrderApi(data);
      toast.success(res.data.message);

      await removeItemsFromCartApi();
      updateCartCount(0);
      removeItemsFromCart();

      const khaltiPayload = {
        amount: Math.round(subtotal * 100),
        order_id: res.data.orderId || "test-" + Date.now(),
        order_name: "Purchase from StyleSabaiko",
        name: userDetails.name,
        phone: userDetails.phone,
        email: userDetails.email,
        subtotal: Math.round(subtotal * 100),
        vat: 0,
        products,
      };

      const khaltiRes = await khaltiApi(khaltiPayload);
      window.location.href = khaltiRes.data.payment_url;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="order-page">
      <h1>Order Page</h1>

      <div className="order-content">
        {/* Cart Items Section */}
        <div className="cart-items">
          <h2>Cart Items</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                
                  <div>
                    <div style={{ fontWeight: "600" }}>
                      {item.product.title}
                    </div>
                    <div>
                      Rs. {item.product.price.toFixed(2)} x{" "}
                      <input
                        type="number"
                        min="1"
                        value={userQuantities[item._id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(item._id, e.target.value)
                        }
                        style={{
                          width: "60px",
                          marginTop: "6px",
                          padding: "4px 6px",
                          fontSize: "0.9rem",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <h3>Sub Total: Rs. {subtotal?.toFixed(2)}</h3>
        </div>

        {/* User Details Section */}
        <div className="user-details">
          <h2>User Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={userDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <textarea
                id="address"
                name="address"
                value={userDetails.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <button className="order-button" type="submit">
              Pay with Khalti
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Order;
