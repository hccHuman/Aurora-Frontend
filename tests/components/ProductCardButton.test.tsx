import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCardButton from '@/components/tsx/ProductCard/ProductCardButton';
import { Provider } from 'jotai';

describe('ProductCardButton', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  it('adds item to cart and persists to sessionStorage', () => {
    const Wrapper: React.FC = ({ children }) => <Provider>{children}</Provider>;

    render(<ProductCardButton title="Test" id={"p1"} price={9.99} />, { wrapper: Wrapper });

    const button = screen.getByRole('button', { name: /Añadir Test al carrito/i });
    fireEvent.click(button);

    const raw = sessionStorage.getItem('aurora_cart');
    expect(raw).toBeTruthy();

    const cart = JSON.parse(raw as string);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toMatchObject({ productId: 'p1', title: 'Test', price: 9.99, quantity: 1 });
  });
});
