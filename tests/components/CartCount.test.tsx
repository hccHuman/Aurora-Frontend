import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import CartCount from '@/components/tsx/Header/CartCount';
import { Provider } from 'jotai';
import { cartStore } from '@/store/cartStore';
import { useAtom } from 'jotai';

describe('CartCount', () => {
  it('renders badge with total items when variant=badge', () => {
    const mockCart = { items: [ { productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 1 } ] } as any;

    const TestWrapper: React.FC = ({ children }) => (
      <Provider initialValues={[] as any}>
        {children}
      </Provider>
    );

    const Setter: React.FC = () => {
      const [, setCart] = useAtom(cartStore as any);
      useEffect(() => setCart(mockCart), []);
      return null;
    };

    render(
      <>
        <CartCount variant="badge" />
        <Setter />
      </>,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders button text when variant=button', () => {
    const mockCart = { items: [ { productId: 'p1', quantity: 5 } ] } as any;

    const TestWrapper: React.FC = ({ children }) => (
      <Provider initialValues={[] as any}>
        {children}
      </Provider>
    );

    const Setter: React.FC = () => {
      const [, setCart] = useAtom(cartStore as any);
      useEffect(() => setCart(mockCart), []);
      return null;
    };

    render(
      <>
        <CartCount variant="button" />
        <Setter />
      </>,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText(/Carrito \(5\)/i)).toBeInTheDocument();
  });

  it('updates when cart atom changes', async () => {
    const initial = { items: [ { productId: 'p1', quantity: 1 } ] } as any;
    const TestWrapper: React.FC = ({ children }) => (
      <Provider initialValues={[] as any}>
        {children}
      </Provider>
    );

    const Setter: React.FC = () => {
      const [, setCart] = useAtom(cartStore as any);
      useEffect(() => {
        setCart(initial);
        setTimeout(() => setCart({ items: [ { productId: 'p1', quantity: 4 } ] }), 10);
      }, []);
      return null;
    };

    render(
      <>
        <CartCount variant="badge" />
        <Setter />
      </>,
      { wrapper: TestWrapper }
    );

    // initial render should show 1
    expect(screen.getByText('1')).toBeInTheDocument();

    // after setter runs, expect 4
    const updated = await screen.findByText('4');
    expect(updated).toBeInTheDocument();
  });
});
