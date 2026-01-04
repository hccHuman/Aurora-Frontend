import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PayPalCheckout } from '@/components/tsx/PayPalCheckout/PayPalCheckoutComponent';
import { paymentService } from '@/services/paymentService';
import * as navigation from '@/lib/navigation';
import { Provider } from 'jotai';
import { cartStore } from '@/store/cartStore';

jest.mock('@/services/paymentService');

describe('PayPalCheckout', () => {
  it('creates a payment intent with cart items (prices in cents)', async () => {
    // Arrange: set cart with items
    const mockCart = { items: [
      { productId: 'p1', title: 'T1', price: 12.5, quantity: 2 }, // 1250 cents
      { productId: 'p2', title: 'T2', price: 5.0, quantity: 1 }, // 500 cents
    ] } as any;

    const TestWrapper: React.FC = ({ children }) => (
      <Provider initialValues={[[cartStore, mockCart]]}>
        {children}
      </Provider>
    );

    // Mock paymentService.createPaymentIntent to resolve with generic response
    (paymentService.createPaymentIntent as jest.Mock).mockResolvedValue({ success: true });

    // Ensure user is logged in for this flow and stub navigation to avoid jsdom navigation
    const SetUserLoggedIn: React.FC = () => {
      const [, setUser] = useAtom(require('@/store/userStore').userStore as any);
      useEffect(() => setUser({ loggedIn: true, user: { id: 'u1' } }), []);
      return null;
    };
    const goSpy = jest.spyOn(require('@/lib/navigation'), 'goTo').mockImplementation(() => {});

    // Ensure the cart atom is set inside the rendered tree (some Jotai setups may require runtime set)
    const SetCart: React.FC = () => {
      const [, setCart] = useAtom(cartStore as any);
      useEffect(() => setCart(mockCart), []);
      return null;
    };

    render(
      <>
        <PayPalCheckout />
        <SetCart />
        <SetUserLoggedIn />
      </>,
      { wrapper: TestWrapper }
    );

    const button = screen.getByRole('button', { name: /Pagar con PayPal/i });

    // Act
    fireEvent.click(button);

    // Assert: createPaymentIntent was called with prices converted to cents
    await waitFor(() => expect(paymentService.createPaymentIntent).toHaveBeenCalledWith([
      { price: 1250, quantity: 2 },
      { price: 500, quantity: 1 },
    ]));

    goSpy.mockRestore();
  });

  it('clears cart and redirects to home on successful payment intent without approval URL', async () => {
    const mockCart = { items: [
      { productId: 'p1', title: 'T1', price: 12.5, quantity: 2 },
    ] } as any;

    const TestWrapper: React.FC = ({ children }) => (
      <Provider initialValues={[[cartStore, mockCart]]}>
        {children}
      </Provider>
    );

    (paymentService.createPaymentIntent as jest.Mock).mockResolvedValue({ success: true });

    const SetCart: React.FC = () => {
      const [, setCart] = useAtom(cartStore as any);
      useEffect(() => setCart(mockCart), []);
      return null;
    };

    // Spy on navigation.goTo so we can observe navigation without touching window.location
    const goSpy = jest.spyOn(navigation, 'goTo').mockImplementation(() => {});

    // Ensure user is logged in
    const SetUserLoggedIn: React.FC = () => {
      const [, setUser] = useAtom(require('@/store/userStore').userStore as any);
      useEffect(() => setUser({ loggedIn: true, user: { id: 'u1' } }), []);
      return null;
    };

    render(
      <>
        <PayPalCheckout />
        <SetCart />
        <SetUserLoggedIn />
      </>,
      { wrapper: TestWrapper }
    );

    const button = screen.getByRole('button', { name: /Pagar con PayPal/i });
    fireEvent.click(button);

    await waitFor(() => expect(paymentService.createPaymentIntent).toHaveBeenCalled());

    // Cart should be cleared in sessionStorage
    const raw = sessionStorage.getItem('aurora_cart');
    expect(raw).toBe(JSON.stringify({ items: [] }));

    // And a redirect attempt to home should have been made via the navigation helper
    expect(goSpy).toHaveBeenCalledWith('/');
    goSpy.mockRestore();
  });

  it('redirects to login if user is not logged in', async () => {
    const mockCart = { items: [ { productId: 'p1', title: 'T1', price: 12.5, quantity: 1 } ] } as any;

    const TestWrapper: React.FC = ({ children }) => (
      <Provider initialValues={[[cartStore, mockCart]]}>
        {children}
      </Provider>
    );

    (paymentService.createPaymentIntent as jest.Mock).mockResolvedValue({ success: true });

    const SetCart: React.FC = () => {
      const [, setCart] = useAtom(cartStore as any);
      useEffect(() => setCart(mockCart), []);
      return null;
    };

    // Spy navigation.goTo
    const goSpy = jest.spyOn(navigation, 'goTo').mockImplementation(() => {});

    // Also set userStore to logged out at runtime
    const SetUser: React.FC = () => {
      const [, setUser] = useAtom(require('@/store/userStore').userStore as any);
      useEffect(() => setUser({ loggedIn: false, user: null }), []);
      return null;
    };

    render(
      <>
        <PayPalCheckout />
        <SetCart />
        <SetUser />
      </>,
      { wrapper: TestWrapper }
    );

    const button = screen.getByRole('button', { name: /Pagar con PayPal/i });
    fireEvent.click(button);

    // Should attempt to redirect to login and not call paymentService
    await waitFor(() => expect(goSpy).toHaveBeenCalled());
    expect(paymentService.createPaymentIntent).not.toHaveBeenCalled();
    goSpy.mockRestore();
  });

  it('redirects to login if backend returns 401 when creating payment intent', async () => {
    const mockCart = { items: [ { productId: 'p1', title: 'T1', price: 12.5, quantity: 1 } ] } as any;

    const TestWrapper: React.FC = ({ children }) => (
      <Provider initialValues={[[cartStore, mockCart]]}>
        {children}
      </Provider>
    );

    (paymentService.createPaymentIntent as jest.Mock).mockRejectedValue(Object.assign(new Error('Unauthorized'), { status: 401 }));

    const SetCart: React.FC = () => {
      const [, setCart] = useAtom(cartStore as any);
      useEffect(() => setCart(mockCart), []);
      return null;
    };

    const goSpy = jest.spyOn(navigation, 'goTo').mockImplementation(() => {});

    // Ensure userStore is considered logged in for this case (server will still return 401)
    const SetUserLoggedIn: React.FC = () => {
      const [, setUser] = useAtom(require('@/store/userStore').userStore as any);
      useEffect(() => setUser({ loggedIn: true, user: { id: 'u1' } }), []);
      return null;
    };

    render(
      <>
        <PayPalCheckout />
        <SetCart />
        <SetUserLoggedIn />
      </>,
      { wrapper: TestWrapper }
    );

    const button = screen.getByRole('button', { name: /Pagar con PayPal/i });
    fireEvent.click(button);

    await waitFor(() => expect(goSpy).toHaveBeenCalled());
    goSpy.mockRestore();
  });

  it('redirects to login immediately if sessionStorage login is false', async () => {
    const mockCart = { items: [ { productId: 'p1', title: 'T1', price: 12.5, quantity: 1 } ] } as any;

    const TestWrapper: React.FC = ({ children }) => (
      <Provider initialValues={[[cartStore, mockCart]]}>
        {children}
      </Provider>
    );

    const SetCart: React.FC = () => {
      const [, setCart] = useAtom(cartStore as any);
      useEffect(() => setCart(mockCart), []);
      return null;
    };

    // Simulate sessionStorage marking user as logged out
    sessionStorage.setItem('login', 'false');

    const goSpy = jest.spyOn(navigation, 'goTo').mockImplementation(() => {});

    render(
      <>
        <PayPalCheckout />
        <SetCart />
      </>,
      { wrapper: TestWrapper }
    );

    const button = screen.getByRole('button', { name: /Pagar con PayPal/i });
    fireEvent.click(button);

    // Should redirect immediately and not call createPaymentIntent
    await waitFor(() => expect(goSpy).toHaveBeenCalled());
    expect(paymentService.createPaymentIntent).not.toHaveBeenCalled();
    goSpy.mockRestore();

    // cleanup
    sessionStorage.removeItem('login');
  });
});
