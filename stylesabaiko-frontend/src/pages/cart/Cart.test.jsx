import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from './Cart';
import { CartProvider } from '../../components/Context/CartContext';

const renderWithProviders = (ui, { ...options } = {}) => {
    return render(
        <CartProvider>
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        </CartProvider>,
        options
    );
};

describe('Cart Component', () => {
    const mockCartItems = [
        {
            _id: '1',
            product: {
                title: 'Product 1',
                price: 100,
                imageUrl: '/images/product1.jpg',
            },
        },
        {
            _id: '2',
            product: {
                title: 'Product 2',
                price: 200,
                imageUrl: '/images/product2.jpg',
            },
        },
    ];

    it('renders the cart items', () => {
        renderWithProviders(<Cart />, {
            initialCartState: {
                cartItems: mockCartItems,
            },
        });

        expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Product 2/i)).toBeInTheDocument();
        expect(screen.getByText(/Rs. 100.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Rs. 200.00/i)).toBeInTheDocument();
    });

    it('updates quantity when + button is clicked', () => {
        renderWithProviders(<Cart />, {
            initialCartState: {
                cartItems: mockCartItems,
            },
        });

        const quantityInput = screen.getAllByRole('textbox')[0];
        expect(quantityInput.value).toBe('1');

        const addButton = screen.getAllByText('+')[0];
        fireEvent.click(addButton);

        expect(quantityInput.value).toBe('2');
    });

    it('removes item from cart when remove button is clicked', () => {
        renderWithProviders(<Cart />, {
            initialCartState: {
                cartItems: mockCartItems,
            },
        });

        const removeButton = screen.getAllByText(/Remove/i)[0];
        fireEvent.click(removeButton);

        expect(screen.queryByText(/Product 1/i)).not.toBeInTheDocument();
    });
});
