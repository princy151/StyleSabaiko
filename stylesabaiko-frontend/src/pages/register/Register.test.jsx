import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';
import { registerUserApi } from '../../apis/Api';
import { toast } from 'react-toastify';

jest.mock('../../apis/Api');
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

describe('Register Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the registration form', () => {
        render(<Register />);
        expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Phone/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    });

    it('displays error messages for empty fields on submit', () => {
        render(<Register />);
        const continueButton = screen.getByText(/Continue/i);

        fireEvent.click(continueButton);

        expect(screen.getByText(/Fullname is Required/i)).toBeInTheDocument();
        expect(screen.getByText(/Phone is Required/i)).toBeInTheDocument();
        expect(screen.getByText(/Email is Required/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is Required/i)).toBeInTheDocument();
    });

    it('calls registerUserApi on successful form submission', async () => {
        const mockResponse = {
            data: {
                success: true,
                message: 'Registration successful',
            },
        };
        registerUserApi.mockResolvedValue(mockResponse);

        render(<Register />);
        fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'Brinda Bhattarai' } });
        fireEvent.change(screen.getByPlaceholderText(/Phone/i), { target: { value: '9866155024' } });
        fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: 'brindabh@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'brinda123' } });

        const continueButton = screen.getByText(/Continue/i);
        fireEvent.click(continueButton);

        expect(registerUserApi).toHaveBeenCalledWith({
            fullName: 'Brinda Bhattarai',
            phone: '9866155024',
            email: 'brindabh@gmail.com',
            password: 'brinda123',
        });

        expect(toast.success).toHaveBeenCalledWith('Registration successful');
    });

    it('displays error toast on API failure', async () => {
        const mockResponse = {
            data: {
                success: false,
                message: 'Registration failed',
            },
        };
        registerUserApi.mockResolvedValue(mockResponse);

        render(<Register />);
        fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'Brinda Bhattarai' } });
        fireEvent.change(screen.getByPlaceholderText(/Phone/i), { target: { value: '9866155024' } });
        fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: 'brindabh@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'brinda123' } });

        const continueButton = screen.getByText(/Continue/i);
        fireEvent.click(continueButton);

        expect(registerUserApi).toHaveBeenCalledWith({
            fullName: 'Brinda Bhattarai',
            phone: '9866155024',
            email: 'brindabh@gmail.com',
            password: 'brinda123',
        });

        expect(toast.error).toHaveBeenCalledWith('Registration failed');
    });
});
