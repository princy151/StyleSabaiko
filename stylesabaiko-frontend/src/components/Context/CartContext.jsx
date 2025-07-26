import React, { createContext, useState, useContext, useEffect } from 'react';
import { getItemsFromCartApi, addItemToCartApi, removeItemFromCartApi } from '../../apis/Api';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = (count) => {
        setCartCount(count);
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const res = await getItemsFromCartApi();
            setCartItems(res.data.cartItems);
            setCartCount(res.data.cartItems.length);
        } catch (err) {
            console.error('Failed to fetch cart items:', err);
        }
    };

    const addToCart = async (product) => {
        try {
            const res = await addItemToCartApi({ product })
            toast.success(res.data.message)
            await fetchCartItems(); // Refresh the cart items after adding
        } catch (err) {
            console.error('Failed to add item to cart:', err);
            toast.error(err.response.data.message)
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const res = await removeItemFromCartApi(productId);
            toast.success(res.data.message)
            await fetchCartItems(); // Refresh the cart items after removing
        } catch (err) {
            console.error('Failed to remove item from cart:', err);
        }
    };

    const removeItemsFromCart = async () => {
        setCartItems([]);
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount, updateCartCount, removeItemsFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
