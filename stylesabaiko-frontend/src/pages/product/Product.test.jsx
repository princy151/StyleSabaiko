import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Product from './Product';
import { getProductApi } from '../../apis/Api';

jest.mock('../../apis/Api');
jest.mock('../../components/ProductDisplay/ProductDisplay', () => ({ product }) => (
    <div>Product Display: {product.title}</div>
));


describe('Product Component', () => {
    it('renders the ProductDisplay component when product is fetched successfully', async () => {
        const mockProduct = {
            _id: '6684ee6b69c2eaac5d8e3e61',
            title: 'Stylish Slipper',
            description: 'Chic black-and-white flat slippers.',
            category: 'women',
            price: 100,
            buyCount: 4,
            imageUrl: '1721296603526-WS1.png',
            createdAt: '2024-07-03T06:16:23.990+00:00'
        };

        getProductApi.mockResolvedValue({ data: { product: mockProduct } });

        renderWithRouter(<Product />, { route: '/product/6684ee6b69c2eaac5d8e3e61' });

        await waitFor(() => {
            expect(screen.getByText('Product Display: Stylish Slipper')).toBeInTheDocument();
        });
    });

    it('does not render ProductDisplay component when product is not fetched', async () => {
        getProductApi.mockRejectedValue(new Error('Failed to fetch'));

        renderWithRouter(<Product />, { route: '/product/6684ee6b69c2eaac5d8e3e61' });

        await waitFor(() => {
            expect(screen.queryByText('Product Display:')).not.toBeInTheDocument();
        });
    });
});
