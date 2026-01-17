import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import CheckoutComponent from '@/components/tsx/Checkout/CheckoutComponent';
import { cartStore } from '@/store/cartStore';
import { userStore } from '@/store/userStore';
import { paymentService } from '@/services/paymentService';

// Mocks
jest.mock('@/lib/navigation', () => ({
    goTo: jest.fn(),
}));

jest.mock('@/services/paymentService', () => ({
    paymentService: {
        Order: jest.fn(),
    },
}));

// Hydration helper for Jotai in tests
const HydrateAtoms = ({ initialValues, children }: any) => {
    useHydrateAtoms(initialValues);
    return children;
};

const TestProvider = ({ initialValues, children }: any) => (
    <Provider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
);

describe('Integration: Cart + Checkout', () => {
    const initialCart = {
        items: [
            { productId: '1', title: 'Product 1', price: 10, quantity: 2 },
            { productId: '2', title: 'Product 2', price: 20, quantity: 1 },
        ],
    };

    const loggedInUser = {
        ready: true,
        loggedIn: true,
        user: { id: 'user-123', email: 'test@example.com' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should display items from cartStore and calculate total', () => {
        render(
            <TestProvider initialValues={[[cartStore, initialCart], [userStore, loggedInUser]]}>
                <CheckoutComponent lang="en" />
            </TestProvider>
        );

        expect(screen.getByText('Product 1')).toBeDefined();
        expect(screen.getByText('Product 2')).toBeDefined();
        // Total should be (10*2) + (20*1) = 40.00
        expect(screen.getByText(/40\.00\s*€/)).toBeDefined();
    });

    it('should show empty state if cart has no items', () => {
        render(
            <TestProvider initialValues={[[cartStore, { items: [] }], [userStore, loggedInUser]]}>
                <CheckoutComponent lang="en" />
            </TestProvider>
        );

        // Should show "Your cart is empty"
        expect(screen.getByText(/cart is empty/i)).toBeDefined();
    });

    it('should call paymentService.Order when checkout button is clicked', async () => {
        const mockOrder = (paymentService.Order as jest.Mock).mockResolvedValue({ clientSecret: 'secret_123' });

        render(
            <TestProvider initialValues={[[cartStore, initialCart], [userStore, loggedInUser]]}>
                <CheckoutComponent lang="en" />
            </TestProvider>
        );

        const payButton = screen.getByRole('button', { name: /Pay/i });
        fireEvent.click(payButton);

        expect(mockOrder).toHaveBeenCalled();
    });
});
