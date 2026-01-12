import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutComponent from '@/components/tsx/Checkout/CheckoutComponent';
import { Provider, createStore } from 'jotai';

jest.mock('@/services/paymentService', () => ({
  paymentService: {
    Order: jest.fn(async (items: any) => ({ success: true, clientSecret: 'x' })),
  },
}));

import { cartStore } from '@/store/cartStore';
import { userStore } from '@/store/userStore';

describe('CheckoutComponent', () => {
  it('creates payment intent and clears cart on success', async () => {
    const store = createStore();

    store.set(cartStore, { items: [{ productId: 1, title: 'X', price: 12.5, quantity: 2 }] });
    store.set(userStore, { loggedIn: true, user: { id: 'u1' }, ready: true });

    render(
      <Provider store={store}>
        <CheckoutComponent />
      </Provider>
    );

    expect(await screen.findByText(/X/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /pagar/i }));

    await waitFor(() => expect(screen.getByText(/Pago iniciado correctamente/i)).toBeInTheDocument());

    // cart should be cleared
    await waitFor(() => expect(screen.getByText(/carrito/i)).toBeInTheDocument());
    expect(screen.getByText(/vac/i)).toBeInTheDocument();
  });

  it('redirects to login if user is not authenticated', async () => {
    const store = createStore();
    store.set(cartStore, { items: [{ productId: 1, title: 'X', price: 12.5, quantity: 2 }] });

    // Set userStore to logged out
    store.set(userStore, { loggedIn: false, user: null, ready: true });

    const navigation = require('@/lib/navigation');
    const goSpy = jest.spyOn(navigation, 'goTo').mockImplementation(() => { });

    render(
      <Provider store={store}>
        <CheckoutComponent />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /pagar/i }));

    await waitFor(() => expect(goSpy).toHaveBeenCalled(), { timeout: 2000 });
    goSpy.mockRestore();
  });

  it('redirects to login if createPaymentIntent returns 401', async () => {
    const store = createStore();
    store.set(cartStore, { items: [{ productId: 1, title: 'X', price: 12.5, quantity: 2 }] });

    // Set userStore to logged in but it will fail the service
    store.set(userStore, { loggedIn: true, user: { id: 'u1' }, ready: true });

    // Mock paymentService to throw a 401
    const { paymentService: ps } = require('@/services/paymentService');
    ps.Order = jest.fn(async () => {
      const e: any = new Error('Unauthorized');
      e.status = 401;
      return Promise.reject(e);
    });

    const navigation = require('@/lib/navigation');
    const goSpy = jest.spyOn(navigation, 'goTo').mockImplementation(() => { });

    render(
      <Provider store={store}>
        <CheckoutComponent />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /pagar/i }));

    await waitFor(() => expect(goSpy).toHaveBeenCalled(), { timeout: 2000 });
    goSpy.mockRestore();
  });

  it('redirects to login immediately if sessionStorage login is false', async () => {
    const store = createStore();
    store.set(cartStore, { items: [{ productId: 1, title: 'X', price: 12.5, quantity: 2 }] });
    store.set(userStore, { loggedIn: true, user: { id: 'u1' }, ready: true });

    // make sessionStorage indicate logged out
    sessionStorage.setItem('login', 'false');

    const navigation = require('@/lib/navigation');
    const goSpy = jest.spyOn(navigation, 'goTo').mockImplementation(() => { });

    render(
      <Provider store={store}>
        <CheckoutComponent />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /pagar/i }));

    await waitFor(() => expect(goSpy).toHaveBeenCalled(), { timeout: 2000 });
    goSpy.mockRestore();

    // cleanup
    sessionStorage.removeItem('login');
  });
});
