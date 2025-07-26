import React, { useEffect, useState } from "react";
import { getAllOrdersApi, updateOrderStatusApi } from "../../apis/Api";
import "../Product/Product.css"

const ListOrder = () => {
    const [allOrders, setAllOrders] = useState([]);

    const fetchOrders = () => {
        getAllOrdersApi()
            .then((res) => {
                setAllOrders(res.data.orders);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    };

    const updateOrder = (id, status) => {
        updateOrderStatusApi(id, status)
            .then(() => {
                fetchOrders();  // Refresh orders list after update
            })
            .catch((error) => {
                console.error("Error updating order:", error);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = (event, orderId) => {
        const newStatus = event.target.value;
        updateOrder(orderId, newStatus);
    };

    return (
        <div className="listproduct">
            <h1>Orders</h1>
            <div className="listproduct-header">
            </div>
            <div className="listproduct-format-main">
                <p>Order Number</p> <p>Grand Total</p> <p>Ordered At</p> <p>Ordered By</p> <p>Actions</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allOrders.map((product, index) => (
                    <div key={index}>
                        <div className="listproduct-format">
                            <p className="cartitems-product-title">{product.orderId}</p>
                            <p>Rs. {product.grandTotal}</p>
                            <p>{new Date(product.createdAt).toLocaleDateString()}</p>
                            <p>
                                {product.receiverName}, {product.receiverEmail}
                            </p>
                            <p>
                                <select
                                    className="status-dropdown"
                                    defaultValue={product.orderStatus}
                                    onChange={(event) => handleStatusChange(event, product._id)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </p>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListOrder;
