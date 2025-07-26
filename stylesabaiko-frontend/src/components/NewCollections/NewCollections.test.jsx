import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import NewCollections from './NewCollections';
import { getNewProductsApi } from '../../apis/Api';

jest.mock('../../apis/Api');
jest.mock('../Item/Item', () => ({ id, name, image, price, description, category }) => (
    <div data-testid="item">
        <h2>{name}</h2>
        <img src={image} alt={name} />
        <p>{price}</p>
    </div>
));

describe('NewCollections Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the NewCollections component', () => {
        render(<NewCollections />);
        expect(screen.getByText(/NEW COLLECTIONS/i)).toBeInTheDocument();
    });

    it('fetches and displays new products on mount', async () => {
        const mockProducts = [
            { _id: '1', title: 'Product 1', imageUrl: 'image1.jpg', price: 100, description: 'Description 1', category: 'Category 1' },
            { _id: '2', title: 'Product 2', imageUrl: 'image2.jpg', price: 200, description: 'Description 2', category: 'Category 2' },
            // Add more mock products if needed
        ];

        getNewProductsApi.mockResolvedValue({ data: { products: mockProducts } });

        render(<NewCollections />);

        await waitFor(() => {
            expect(getNewProductsApi).toHaveBeenCalledTimes(1);
        });

        // Check that the items are rendered
        const items = screen.getAllByTestId('item');
        expect(items).toHaveLength(mockProducts.length);
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
        getNewProductsApi.mockRejectedValue(new Error('API Error'));

        render(<NewCollections />);

        await waitFor(() => {
            expect(getNewProductsApi).toHaveBeenCalledTimes(1);
        });

        expect(screen.queryAllByTestId('item')).toHaveLength(0); // No items should be rendered
    });
});
