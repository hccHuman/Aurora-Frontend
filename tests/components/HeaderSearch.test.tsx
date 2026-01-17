import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import HeaderSearch from '@/components/tsx/Header/HeaderSearch';

// Mock the searchProducts function imported inside the component
jest.mock('@/services/productService', () => ({
  searchProducts: jest.fn(),
}));

import { searchProducts } from '@/services/productService';

describe('HeaderSearch component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // make sure window location is the All Products page so the component activates
    window.history.pushState({}, 'test', '/products/allproducts');
    // ensure a global modal function exists for click behavior
    (window as any).openProductModal = jest.fn();
    (searchProducts as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('sanitizes input and calls searchProducts after debounce', async () => {
    (searchProducts as jest.Mock).mockResolvedValueOnce({ data: [{ id: 1, nombre: 'Freno', precio: 10, img_url: '/img/freno.png' }] });

    render(<HeaderSearch />);

    const input = screen.getByRole('searchbox', { name: /search products/i }); // English aria-label
    fireEvent.change(input, { target: { value: 'Freno<script>' } });

    // advance timers for debounce, wrapped in act to avoid warnings
    await act(async () => {
      jest.advanceTimersByTime(350);
      // give microtask queue a tick so the async callback finishes
      await Promise.resolve();
    });

    await waitFor(() => expect(searchProducts).toHaveBeenCalledWith('Frenoscript', 1, 5));

    // dropdown should NOT render results on simple typing (only below results update)
    expect(screen.queryByText('Freno')).not.toBeInTheDocument();
  });

  it('focus triggers immediate search (tap behavior) and no dropdown appears', async () => {
    (searchProducts as jest.Mock).mockResolvedValueOnce({ data: [{ id: 42, nombre: 'Freno Turbo', precio: 33, img_url: '/img/x.png' }] });

    render(<HeaderSearch />);
    const input = screen.getByRole('searchbox', { name: /search products/i }); // English aria-label
    // set value then focus (simulating a tap)
    fireEvent.change(input, { target: { value: 'Turbo<script>' } });

    // focus should immediately trigger a search (no debounce)
    fireEvent.focus(input);

    await waitFor(() => expect(searchProducts).toHaveBeenCalledWith('Turboscript', 1, 5));

    // dropdown was removed entirely — ensure no result elements from dropdown are present
    expect(screen.queryByText('Freno Turbo')).not.toBeInTheDocument();
  });
});
