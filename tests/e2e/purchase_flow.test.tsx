import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import RegisterComponent from '@/components/tsx/AuthForm/RegisterComponent';
import ProductCardButton from '@/components/tsx/ProductCard/ProductCardButton';
import CheckoutComponent from '@/components/tsx/Checkout/CheckoutComponent';
import { cartStore } from '@/store/cartStore';
import { userStore } from '@/store/userStore';
import { clientService } from '@/services/clientService';
import { paymentService } from '@/services/paymentService';

// Mocks
jest.mock('@/services/clientService', () => ({
    clientService: {
        register: jest.fn(),
    },
}));

jest.mock('@/services/paymentService', () => ({
    paymentService: {
        Order: jest.fn(),
    },
}));

jest.mock('@/lib/navigation', () => ({
    goTo: jest.fn(),
}));

const HydrateAtoms = ({ initialValues, children }: any) => {
    useHydrateAtoms(initialValues);
    return children;
};

const TestProvider = ({ initialValues = [], children }: any) => (
    <Provider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
);

describe('E2E: Purchase Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
        localStorage.clear();
    });

    it('should complete a full purchase journey', async () => {
        // 1. REGISTER
        (clientService.register as jest.Mock).mockResolvedValue({
            user: { id: 'user_e2e', email: 'e2e@test.com', nombre: 'E2E User' }
        });

        const { rerender } = render(
            <TestProvider>
                <RegisterComponent lang="en" />
            </TestProvider>
        );

        const nameInput = screen.getByPlaceholderText(/Name/i);
        const form = nameInput.closest('form')!;

        fireEvent.change(nameInput, { target: { value: 'TestUser' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'e2e@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: 'Aurora123!' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), { target: { value: 'Aurora123!' } });
        fireEvent.submit(form);

        await waitFor(() => expect(screen.getByText(/Account created successfully/i)).toBeInTheDocument());

        // 2. ADD TO CART (Simulated by rendering the button with the now-logged-in store)
        const loggedInUser = {
            ready: true,
            loggedIn: true,
            user: { id: 'user_e2e', email: 'e2e@test.com', nombre: 'E2E User' }
        };

        rerender(
            <TestProvider initialValues={[[userStore, loggedInUser]]}>
                <div>
                    <ProductCardButton title="E2E Product" id={1} price={99.99} category_id={1} lang="en" />
                </div>
            </TestProvider>
        );

        const addToCartBtn = screen.getByRole('button', { name: /Add E2E Product to cart/i });
        fireEvent.click(addToCartBtn);

        // Wait for "Added!" text
        await waitFor(() => expect(screen.getByText(/Added!/i)).toBeInTheDocument());

        // 3. CHECKOUT
        // We need to re-render with the cart having the item
        const cartWithItem = {
            items: [{ productId: 1, title: 'E2E Product', price: 99.99, quantity: 1, category_id: 1 }]
        };

        rerender(
            <TestProvider initialValues={[[userStore, loggedInUser], [cartStore, cartWithItem]]}>
                <CheckoutComponent lang="en" />
            </TestProvider>
        );

        expect(screen.getByText('E2E Product')).toBeInTheDocument();
        // Price appears multiple times (item price, subtotal, total)
        expect(screen.getAllByText(/99\.99\s*€/)[0]).toBeInTheDocument();

        (paymentService.Order as jest.Mock).mockResolvedValue({ clientSecret: 'pi_321' });

        const payBtn = screen.getByRole('button', { name: /Pay/i });
        fireEvent.click(payBtn);

        await waitFor(() => expect(paymentService.Order).toHaveBeenCalled());
        await waitFor(() => expect(screen.getByText(/Payment initiated correctly/i)).toBeInTheDocument());
    });
});
