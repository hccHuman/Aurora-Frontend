import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import RegisterComponent from '@/components/tsx/AuthForm/RegisterComponent';
import { clientService } from '@/services/clientService';

// Mock clientService
jest.mock('@/services/clientService', () => ({
    clientService: {
        register: jest.fn(),
    },
}));

describe('System: RegisterComponent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show error for invalid name', async () => {
        render(
            <Provider>
                <RegisterComponent lang="en" />
            </Provider>
        );

        const nameInput = screen.getByPlaceholderText(/Name/i);
        const form = nameInput.closest('form')!;

        fireEvent.change(nameInput, { target: { value: 'A' } }); // too short/invalid
        fireEvent.submit(form);

        expect(await screen.findByText(/Name is invalid/i)).toBeDefined();
    });

    it('should show error if passwords do not match', async () => {
        render(
            <Provider>
                <RegisterComponent lang="en" />
            </Provider>
        );

        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: 'Strong123!' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), { target: { value: 'Different123!' } });

        const form = screen.getByPlaceholderText(/Name/i).closest('form')!;
        fireEvent.submit(form);

        expect(await screen.findByText(/Passwords do not match/i)).toBeDefined();
    });

    it('should succeed with valid data', async () => {
        (clientService.register as jest.Mock).mockResolvedValue({
            user: { id: '2', email: 'new@example.com', nombre: 'New User' }
        });

        render(
            <Provider>
                <RegisterComponent lang="en" />
            </Provider>
        );

        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'New User' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: 'Strong123!' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), { target: { value: 'Strong123!' } });

        const form = screen.getByPlaceholderText(/Name/i).closest('form')!;
        fireEvent.submit(form);

        expect(await screen.findByText(/Account created successfully/i)).toBeDefined();
    });
});
