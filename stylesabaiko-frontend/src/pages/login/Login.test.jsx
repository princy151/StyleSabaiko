import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { loginUserApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../apis/Api');
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

const renderWithRouter = (ui) => {
    return render(ui, { wrapper: BrowserRouter });
};

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('renders the Login component correctly', () => {
        renderWithRouter(<Login />);

        expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });

    it('displays validation errors when fields are empty on submit', () => {
        renderWithRouter(<Login />);

        const submitButton = screen.getByText(/Continue/i);
        fireEvent.click(submitButton);

        expect(screen.getByText(/Email is empty or invalid/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is Required/i)).toBeInTheDocument();
    });

    it('calls loginUserApi and handles successful login', async () => {
        const mockResponse = {
            data: {
                success: true,
                token: 'mockToken',
                userData: { name: 'John Doe' },
            },
        };

        loginUserApi.mockResolvedValue(mockResponse);

        renderWithRouter(<Login />);

        fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

        const submitButton = screen.getByText(/Continue/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(loginUserApi).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mockToken');
            expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ name: 'John Doe' }));
        });
    });

    it('handles API error and displays toast error', async () => {
        loginUserApi.mockRejectedValue(new Error('API Error'));

        renderWithRouter(<Login />);

        fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

        const submitButton = screen.getByText(/Continue/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("An error occurred while logging in. Please try again.");
        });
    });

    it('displays toast error if login fails', async () => {
        const mockResponse = {
            data: {
                success: false,
                message: 'Invalid credentials',
            },
        };

        loginUserApi.mockResolvedValue(mockResponse);

        renderWithRouter(<Login />);

        fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

        const submitButton = screen.getByText(/Continue/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
        });
    });
});
