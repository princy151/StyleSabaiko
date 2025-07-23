import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

const renderWithRouter = (ui) => {
    return render(ui, { wrapper: BrowserRouter });
};

describe('Footer Component', () => {
    it('renders the Footer component with correct sections and links', () => {
        renderWithRouter(<Footer />);

        // Check for section headings
        expect(screen.getByText(/Company/i)).toBeInTheDocument();
        expect(screen.getByText(/Support/i)).toBeInTheDocument();
        expect(screen.getByText(/Contact/i)).toBeInTheDocument();
        expect(screen.getByText(/Newsletter/i)).toBeInTheDocument();

        // Check for links in the Company section
        expect(screen.getByText(/About Us/i)).toHaveAttribute('href', '/about');
        expect(screen.getByText(/Careers/i)).toHaveAttribute('href', '/careers');
        expect(screen.getByText(/Contact Us/i)).toHaveAttribute('href', '/contact');
        expect(screen.getByText(/Blog/i)).toHaveAttribute('href', '/blog');

        // Check for links in the Support section
        expect(screen.getByText(/FAQ/i)).toHaveAttribute('href', '/faq');
        expect(screen.getByText(/Shipping & Returns/i)).toHaveAttribute('href', '/shipping');
        expect(screen.getByText(/Privacy Policy/i)).toHaveAttribute('href', '/privacy');
        expect(screen.getByText(/Terms & Conditions/i)).toHaveAttribute('href', '/terms');

        // Check for contact details
        expect(screen.getByText(/Bhairahawa, Nepal/i)).toBeInTheDocument();
        expect(screen.getByText(/help@walkwise.com/i)).toBeInTheDocument();
        expect(screen.getByText(/\+977-9862712973/i)).toBeInTheDocument();
    });

    it('renders the correct current year in the footer bottom', () => {
        renderWithRouter(<Footer />);

        const year = new Date().getFullYear();
        expect(screen.getByText(`© ${year} Walkwise. All rights reserved.`)).toBeInTheDocument();
    });

    it('handles the newsletter subscription form correctly', () => {
        renderWithRouter(<Footer />);

        const emailInput = screen.getByPlaceholderText(/Your email address/i);
        const subscribeButton = screen.getByText(/Subscribe/i);

        fireEvent.change(emailInput, { target: { value: 'help@walkwise.com' } });
        fireEvent.click(subscribeButton);

        expect(emailInput.value).toBe('help@walkwise.com');
    });

    it('renders social media icons with links', () => {
        renderWithRouter(<Footer />);

        const facebookIcon = screen.getByLabelText(/facebook/i);
        const twitterIcon = screen.getByLabelText(/twitter/i);
        const instagramIcon = screen.getByLabelText(/instagram/i);
        const linkedinIcon = screen.getByLabelText(/linkedin/i);

        expect(facebookIcon).toBeInTheDocument();
        expect(twitterIcon).toBeInTheDocument();
        expect(instagramIcon).toBeInTheDocument();
        expect(linkedinIcon).toBeInTheDocument();
    });
});
