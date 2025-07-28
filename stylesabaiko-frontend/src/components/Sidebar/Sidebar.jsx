import React from 'react';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineOrderedList } from 'react-icons/ai';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className='sidebar'>
            <Link to='/admin/dashboard/products' style={{ textDecoration: 'none' }}>
                <div className={`sidebar-item ${location.pathname === '/admin/dashboard/products' ? 'active' : ''}`}>
                    <AiOutlineShoppingCart size={24} />
                    <p>Products</p>
                </div>
            </Link>


            <Link to='/admin/dashboard/orders' style={{ textDecoration: 'none' }}>
                <div className={`sidebar-item ${location.pathname === '/admin/dashboard/orders' ? 'active' : ''}`}>
                    <AiOutlineOrderedList size={24} />
                    <p>Orders</p>
                </div>
            </Link>
        </div>
    );
};

export default Sidebar;
