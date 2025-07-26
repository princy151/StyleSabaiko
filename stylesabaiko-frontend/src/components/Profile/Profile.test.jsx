import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './Profile';
import { updateUserApi } from '../../apis/Api';
import { toast } from 'react-toastify';

jest.mock('../../apis/Api');
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('Profile Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('renders the Profile component with user data from localStorage', () => {
        const mockUser = {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+123456789',
            gender: 'Male',
            imageUrl: 'profile.jpg',
        };

        localStorage.setItem('user', JSON.stringify(mockUser));

        render(<Profile />);

        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/\+123456789/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/Male/i)).toBeInTheDocument();
    });

    it('updates profile information and saves it to localStorage', async () => {
        const mockUser = {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+123456789',
            gender: 'Male',
            imageUrl: 'profile.jpg',
        };

        localStorage.setItem('user', JSON.stringify(mockUser));
        const updatedUser = {
            ...mockUser,
            fullName: 'Jane Doe',
            phone: '+987654321',
            gender: 'Female',
        };

        updateUserApi.mockResolvedValue({ data: { message: 'Profile updated successfully' } });

        render(<Profile />);

        fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/\+123456789/i), { target: { value: '+987654321' } });
        fireEvent.change(screen.getByDisplayValue(/Male/i), { target: { value: 'Female' } });

        fireEvent.click(screen.getByText(/Save Changes/i));

        await waitFor(() => {
            expect(updateUserApi).toHaveBeenCalledWith(updatedUser);
            expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
            expect(localStorage.getItem('user')).toEqual(JSON.stringify(updatedUser));
        });
    });

    it('handles image upload and updates the profile picture', async () => {
        const mockUser = {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+123456789',
            gender: 'Male',
            imageUrl: 'profile.jpg',
        };

        localStorage.setItem('user', JSON.stringify(mockUser));

        const mockFile = new Blob(['image content'], { type: 'image/png' });
        const mockImageUrl = 'newProfile.jpg';

        updateUserApi.mockResolvedValue({ data: { user: { imageUrl: mockImageUrl } } });

        render(<Profile />);

        const fileInput = screen.getByLabelText(/edit-icon/i);
        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        await waitFor(() => {
            expect(updateUserApi).toHaveBeenCalledTimes(1);
            expect(localStorage.getItem('user')).toContain(mockImageUrl);
        });
    });

    it('handles API errors gracefully when updating profile information', async () => {
        const mockUser = {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+123456789',
            gender: 'Male',
            imageUrl: 'profile.jpg',
        };

        localStorage.setItem('user', JSON.stringify(mockUser));

        updateUserApi.mockRejectedValue(new Error('API Error'));

        render(<Profile />);

        fireEvent.click(screen.getByText(/Save Changes/i));

        await waitFor(() => {
            expect(updateUserApi).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith('Error saving user data:', 'API Error');
        });
    });
});
