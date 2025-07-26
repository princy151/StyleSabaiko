import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChangePassword from './ChangePassword';
import { changePasswordApi } from '../../apis/Api';
import { toast } from 'react-toastify';

jest.mock('../../apis/Api');
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

describe('ChangePassword Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the ChangePassword form', () => {
        render(<ChangePassword />);
        expect(screen.getByPlaceholderText(/Current Password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/New Password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Confirm New Password/i)).toBeInTheDocument();
    });

    it('displays validation errors when fields are empty on submit', () => {
        render(<ChangePassword />);
        const changePasswordButton = screen.getByText(/Change Password/i);
        fireEvent.click(changePasswordButton);

        expect(screen.getByText(/Please enter Old Password./i)).toBeInTheDocument();
        expect(screen.getByText(/Please enter New Password./i)).toBeInTheDocument();
        expect(screen.getByText(/Please enter New Password For Confirmation./i)).toBeInTheDocument();
    });

    it('displays error when new password and confirm password do not match', () => {
        render(<ChangePassword />);
        fireEvent.change(screen.getByPlaceholderText(/New Password/i), { target: { value: 'brinda124' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm New Password/i), { target: { value: 'brinda124' } });

        const changePasswordButton = screen.getByText(/Change Password/i);
        fireEvent.click(changePasswordButton);

        expect(toast.error).toHaveBeenCalledWith("New Password and Confirmed Password does not match.");
    });

    it('calls changePasswordApi with correct data on successful validation', async () => {
        const mockResponse = { data: { success: true, message: 'Password changed successfully' } };
        changePasswordApi.mockResolvedValue(mockResponse);

        render(<ChangePassword />);
        fireEvent.change(screen.getByPlaceholderText(/Current Password/i), { target: { value: 'brinda1234' } });
        fireEvent.change(screen.getByPlaceholderText(/New Password/i), { target: { value: 'brinda1245' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm New Password/i), { target: { value: 'brinda1245' } });

        const changePasswordButton = screen.getByText(/Change Password/i);
        fireEvent.click(changePasswordButton);

        expect(changePasswordApi).toHaveBeenCalledWith({
            oldPassword: 'brinda1234',
            newPassword: 'brinda1245',
        });

        expect(toast.success).toHaveBeenCalledWith('Password changed successfully');
    });

    it('displays error toast on API failure', async () => {
        const mockError = { response: { status: 400, data: { message: 'Current password is incorrect' } } };
        changePasswordApi.mockRejectedValue(mockError);

        render(<ChangePassword />);
        fireEvent.change(screen.getByPlaceholderText(/Current Password/i), { target: { value: 'brinda123' } });
        fireEvent.change(screen.getByPlaceholderText(/New Password/i), { target: { value: 'brinda124' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm New Password/i), { target: { value: 'brinda124' } });

        const changePasswordButton = screen.getByText(/Change Password/i);
        fireEvent.click(changePasswordButton);

        expect(toast.error).toHaveBeenCalledWith('Current password is incorrect');
    });

    it('displays server error toast when an unknown error occurs', async () => {
        changePasswordApi.mockRejectedValue(new Error('Internal Server Error'));

        render(<ChangePassword />);
        fireEvent.change(screen.getByPlaceholderText(/Current Password/i), { target: { value: 'brinda123' } });
        fireEvent.change(screen.getByPlaceholderText(/New Password/i), { target: { value: 'brinda124' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm New Password/i), { target: { value: 'brinda124' } });

        const changePasswordButton = screen.getByText(/Change Password/i);
        fireEvent.click(changePasswordButton);

        expect(toast.error).toHaveBeenCalledWith('Internal Server Error!');
    });
});
