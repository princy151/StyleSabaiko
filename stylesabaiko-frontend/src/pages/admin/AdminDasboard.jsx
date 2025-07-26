import React, { useState, useEffect } from "react";
import "../CSS/Admin.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getAllOrdersApi, getProductsApi, getUsersApi } from "../../apis/Api";

const Admin = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        getUsersApi().then((res) => setTotalCustomers(res.data.users.length)).catch((err) => { });
        getAllOrdersApi().then((res) => setTotalOrders(res.data.orders.length)).catch((err) => { });
        getProductsApi().then((res) => setTotalProducts(res.data.products.length)).catch((err) => { });
    }, []);

    return (
        <div className="admin">
            <Sidebar />
            <div className="admin-dashboard">
                <h1>Welcome to the Admin Dashboard</h1>
                <div className="dashboard-content">
                    <div className="dashboard-card">
                        <h2>Products</h2>
                        <p>Total: {totalProducts}</p>
                    </div>
                    <div className="dashboard-card">
                        <h2>Customers</h2>
                        <p>Total: {totalCustomers}</p>
                    </div>
                    <div className="dashboard-card">
                        <h2>Orders</h2>
                        <p>Total: {totalOrders}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
