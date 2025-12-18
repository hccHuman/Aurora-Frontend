import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutComponent from '@/components/tsx/Checkout/CheckoutComponent';
import { Provider, createStore } from 'jotai';

jest.mock('@/services/paymentService', () => ({
  paymentService: {
    createPaymentIntent: jest.fn(async (items: any) => ({ success: true, clientSecret: 'x' })),
  },
}));

describe('CheckoutComponent', () => {
  it('creates payment intent and clears cart on success', async () => {
    const { Provider: Prov, createStore: create } = require('jotai');
    const store = create();
    const { cartStore } = require('@/store/cartStore');

    store.set(cartStore, { items: [{ productId: 1, title: 'X', price: 12.5, quantity: 2 }] });

    // Ensure user is logged in for the checkout flow
    const { userStore } = require('@/store/userStore');
    store.set(userStore, { loggedIn: true, user: { id: 'u1' } });

    render(
      <Prov store={store}>
        <CheckoutComponent />
      </Prov>
    );

    expect(await screen.findByText(/X/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /pagar/i }));

    await waitFor(() => expect(screen.getByText(/Pago iniciado correctamente/i)).toBeInTheDocument());

    // cart should be cleared
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });

  it('redirects to login if user is not authenticated', async () => {
    const { Provider: Prov, createStore: create } = require('jotai');
    const store = create();
    const { cartStore } = require('@/store/cartStore');

    store.set(cartStore, { items: [{ productId: 1, title: 'X', price: 12.5, quantity: 2 }] });

    // Set userStore to logged out
    const { userStore } = require('@/store/userStore');
    store.set(userStore, { loggedIn: false, user: null });

    const navigation = require('@/lib/navigation');
    const goSpy = jest.spyOn(navigation, 'goTo').mockImplementation(() => {});

    render(
      <Prov store={store}>
        <CheckoutComponent />
      </Prov>
    );

    fireEvent.click(screen.getByRole('button', { name: /pagar/i }));

    await waitFor(() => expect(goSpy).toHaveBeenCalled());
    goSpy.mockRestore();
  });

  it('redirects to login if createPaymentIntent returns 401', async () => {
    const { Provider: Prov, createStore: create } = require('jotai');
    const store = create();
    const { cartStore } = require('@/store/cartStore');

    store.set(cartStore, { items: [{ productId: 1, title: 'X', price: 12.5, quantity: 2 }] });

    // Mock paymentService to throw a 401
    const paymentService = require('@/services/paymentService').paymentService;
    paymentService.createPaymentIntent = jest.fn(async () => { const e: any = new Error('Unauthorized'); e.status = 401; throw e; });

    const navigation = require('@/lib/navigation');
    const goSpy = jest.spyOn(navigation, 'goTo').mockImplementation(() => {});

    render(
      <Prov store={store}>
        <CheckoutComponent />
      </Prov>
    );

    fireEvent.click(screen.getByRole('button', { name: /pagar/i }));

    await waitFor(() => expect(goSpy).toHaveBeenCalled());
    goSpy.mockRestore();
  });

  it('redirects to login immediately if sessionStorage login is false', async () => {
    const { Provider: Prov, createStore: create } = require('jotai');
    const store = create();
    const { cartStore } = require('@/store/cartStore');

    store.set(cartStore, { items: [{ productId: 1, title: 'X', price: 12.5, quantity: 2 }] });

    // make sessionStorage indicate logged out
    sessionStorage.setItem('login', 'false');

    const navigation = require('@/lib/navigation');
    const goSpy = jest.spyOn(navigation, 'goTo').mockImplementation(() => {});

    render(
      <Prov store={store}>
        <CheckoutComponent />
      </Prov>
    );

    fireEvent.click(screen.getByRole('button', { name: /pagar/i }));

    await waitFor(() => expect(goSpy).toHaveBeenCalled());
    goSpy.mockRestore();

    // cleanup
    sessionStorage.removeItem('login');
  });
});
