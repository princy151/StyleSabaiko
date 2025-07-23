import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Popular from './Popular';
import { getPopularProductsApi } from '../../apis/Api';

jest.mock('../../apis/Api');
jest.mock('../Item/Item', () => ({ id, name, image, price, description, category }) => (
    <div data-testid="item">
        <h2>{name}</h2>
        <img src={image} alt={name} />
        <p>{price}</p>
    </div>
));

describe('Popular Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the Popular component and fetches popular products', async () => {
        const mockProducts = [
            { _id: '1', title: 'Product 1', imageUrl: 'image1.jpg', price: 100, description: 'Description 1', category: 'Category 1' },
            { _id: '2', title: 'Product 2', imageUrl: 'image2.jpg', price: 200, description: 'Description 2', category: 'Category 2' },
        ];

        getPopularProductsApi.mockResolvedValue({ data: { products: mockProducts } });

        render(<Popular />);

        await waitFor(() => {
            expect(getPopularProductsApi).toHaveBeenCalledTimes(1);
        });

        // Check that the items are rendered
        const items = screen.getAllByTestId('item');
        expect(items).toHaveLength(mockProducts.length);
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
        getPopularProductsApi.mockRejectedValue(new Error('API Error'));

        render(<Popular />);

        await waitFor(() => {
            expect(getPopularProductsApi).toHaveBeenCalledTimes(1);
        });

        expect(screen.queryAllByTestId('item')).toHaveLength(0); // No items should be rendered
    });
});
