import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import LoginComponent from '@/components/tsx/AuthForm/LoginComponent';
import { clientService } from '@/services/clientService';

// Mock clientService
jest.mock('@/services/clientService', () => ({
    clientService: {
        login: jest.fn(),
    },
}));

describe('System: LoginComponent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show error for invalid email', async () => {
        render(
            <Provider>
                <LoginComponent lang="en" />
            </Provider>
        );

        const emailInput = screen.getByPlaceholderText(/Email/i);
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        const form = emailInput.closest('form')!;

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        fireEvent.submit(form);

        expect(await screen.findByText(/Email is invalid/i)).toBeDefined();
    });

    it('should show error for weak password', async () => {
        render(
            <Provider>
                <LoginComponent lang="en" />
            </Provider>
        );

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'weak' } });
        fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

        expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeDefined();
    });

    it('should succeed with valid credentials and redirect', async () => {
        (clientService.login as jest.Mock).mockResolvedValue({
            user: { id: '1', email: 'test@example.com' }
        });

        render(
            <Provider>
                <LoginComponent lang="en" />
            </Provider>
        );

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'Strong123!' } });
        fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

        expect(await screen.findByText(/Login successful/i)).toBeDefined();
    });
});
