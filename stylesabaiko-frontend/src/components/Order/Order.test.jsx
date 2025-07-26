import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ListOrder from './ListOrder';
import { getAllOrdersApi, updateOrderStatusApi } from '../../apis/Api';

jest.mock('../../apis/Api');

describe('ListOrder Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the ListOrder component and fetches orders', async () => {
        const mockOrders = [
            {
                _id: '1',
                orderId: 'ORD123',
                grandTotal: 5000,
                createdAt: '2024-08-22T10:20:30Z',
                receiverName: 'John Doe',
                receiverEmail: 'john@example.com',
                orderStatus: 'Pending',
            },
            {
                _id: '2',
                orderId: 'ORD124',
                grandTotal: 1500,
                createdAt: '2024-08-21T10:20:30Z',
                receiverName: 'Jane Doe',
                receiverEmail: 'jane@example.com',
                orderStatus: 'Completed',
            },
        ];

        getAllOrdersApi.mockResolvedValue({ data: { orders: mockOrders } });

        render(<ListOrder />);

        await waitFor(() => {
            expect(getAllOrdersApi).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText(/ORD123/i)).toBeInTheDocument();
        expect(screen.getByText(/ORD124/i)).toBeInTheDocument();
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    });

    it('updates order status when a new status is selected', async () => {
        const mockOrders = [
            {
                _id: '1',
                orderId: 'ORD123',
                grandTotal: 5000,
                createdAt: '2024-08-22T10:20:30Z',
                receiverName: 'John Doe',
                receiverEmail: 'john@example.com',
                orderStatus: 'Pending',
            },
        ];

        getAllOrdersApi.mockResolvedValue({ data: { orders: mockOrders } });
        updateOrderStatusApi.mockResolvedValue({ data: { success: true } });

        render(<ListOrder />);

        await waitFor(() => {
            expect(getAllOrdersApi).toHaveBeenCalledTimes(1);
        });

        const statusDropdown = screen.getByDisplayValue('Pending');
        fireEvent.change(statusDropdown, { target: { value: 'Completed' } });

        expect(updateOrderStatusApi).toHaveBeenCalledWith('1', 'Completed');
    });

    it('handles API errors gracefully when fetching orders', async () => {
        getAllOrdersApi.mockRejectedValue(new Error('API Error'));

        render(<ListOrder />);

        await waitFor(() => {
            expect(getAllOrdersApi).toHaveBeenCalledTimes(1);
        });

        expect(screen.queryByText(/ORD123/i)).not.toBeInTheDocument();
    });
});
