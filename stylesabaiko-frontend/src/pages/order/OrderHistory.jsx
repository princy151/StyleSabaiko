import React, { useEffect, useState } from 'react';
import '../CSS/OrderHistory.css';
import { getOrdersApi } from '../../apis/Api';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 5;

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalFetched, setTotalFetched] = useState([]);

    useEffect(() => {
        setLoading(true);
        getOrdersApi().then((res) => {
            setTotalFetched(res.data.orders);
            setOrders(res.data.orders.slice(0, PAGE_SIZE));
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const totalPages = Math.ceil(totalFetched.length / PAGE_SIZE);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        setOrders(totalFetched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    };

    return (
        <div className="order-history">
            <h2>Order History</h2>
            {loading ? (
                <p className="loading">Loading...</p>
            ) : (
                <><div className="order-list">
                        {orders.map((order, index) => (
                            <Link to={`/order/${order._id}`}>
                            <div key={index} className="order-card">
                                <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${order.products[0].product.imageUrl}`} alt={`Order ${order.orderId}`} className="order-image" />
                                <div className="order-details">
                                    <p className="order-number"><strong>Order Number:</strong> {order.orderId}</p>
                                    <p className="order-date"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className="order-total"><strong>Total:</strong> Rs. {order.grandTotal.toFixed(2)}</p>
                                </div>
                            </div>
                            </Link>
                        ))}
                    </div>
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default OrderHistory;
