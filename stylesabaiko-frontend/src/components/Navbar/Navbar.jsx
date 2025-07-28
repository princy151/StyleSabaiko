import React, { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../Context/CartContext';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [menu, setMenu] = useState("shop");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const menuRef = useRef();
    const dropdownRef = useRef();
    const { cartCount } = useCart();
    const [isLightBackground, setIsLightBackground] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const dropdownToggle = (e) => {
        setDropdownOpen(!dropdownOpen);
        e.target.classList.toggle('open');
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Example logic: light background on homepage only, adjust as needed
        if (location.pathname === '/') {
            setIsLightBackground(false);
        } else {
            setIsLightBackground(true);
        }
    }, [location.pathname]);

    return (
        <div className='navbar'>
            <Link to='/' onClick={() => setMenu("shop")} className="nav-logo">
                <img src={'/Assets/StyleSabaikoLogo.png'} alt="Logo" />
            </Link>

            <img
                onClick={() => menuRef.current.classList.toggle('nav-menu-visible')}
                className='nav-dropdown'
                src={'Assets/nav_dropdown.png'}
                alt="Dropdown"
            />
            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => setMenu("shop")}>
                    <Link to='/'>Shop</Link>
                    {menu === "shop" && <div className="custom-hr"></div>}
                </li>
                <li onClick={() => setMenu("men")}>
                    <Link to='/men'>Male</Link>
                    {menu === "men" && <div className="custom-hr"></div>}
                </li>
                <li onClick={() => setMenu("women")}>
                    <Link to="/women">Female</Link>
                    {menu === "women" && <div className="custom-hr"></div>}
                </li>
                <li onClick={() => setMenu("kids")}>
                    <Link to='/kids'>Kids</Link>
                    {menu === "kids" && <div className="custom-hr"></div>}
                </li>
            </ul>

            <div className="nav-login-cart">
                {user && Object.keys(user).length >= 1 ? (
                    <>
                        <div className={`nav-user-dropdown ${isLightBackground ? 'light-bg' : ''}`} ref={dropdownRef}>
                            <p className="nav-user-name" onClick={dropdownToggle}>
                                Welcome, {user.fullName}
                            </p>
                            {dropdownOpen && (
                                <div className="nav-dropdown-menu">
                                    <Link to='/profile'>Profile</Link>                                    
                                    <Link to='/orders'>Orders</Link>
                                    {/* RBAC implementation */}
                                    {user.isAdmin === true && <Link to='/admin/dashboard/products'>Admin</Link>}
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                        <Link to='/cart'>
                            <img src={'/Assets/cart_icon.png'} alt="Cart" />
                            <div className="nav-cart-count">{cartCount}</div>
                        </Link>
                    </>
                ) : (
                    <Link to='/login'><button>Login</button></Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
