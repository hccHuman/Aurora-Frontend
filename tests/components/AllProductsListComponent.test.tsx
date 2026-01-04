import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AllProductsListComponent from '@/components/tsx/Paginator/AllProductsListComponent';
import { Provider, createStore } from 'jotai';
import { searchStateAtom } from '@/store/searchStore';

jest.mock('@/services/productService', () => ({
  fetchPaginatedProducts: jest.fn(),
}));

import { fetchPaginatedProducts } from '@/services/productService';

describe('AllProductsListComponent', () => {
  beforeEach(() => {
    // set screen size to desktop so pageSize is larger
    (window as any).innerWidth = 1280;
    (fetchPaginatedProducts as jest.Mock).mockReset();
  });

  it('shows search results when search atom has query', async () => {
    const initialSearch = { query: 'Freno', results: [{ id: 99, nombre: 'Freno Turbo', descripcion: 'x', precio: 12, img_url: '/img/x.png' }] };

    const store = createStore();
    store.set(searchStateAtom, initialSearch);

    render(
      <Provider store={store}>
        <AllProductsListComponent />
      </Provider>
    );

    expect(await screen.findByText('Freno Turbo')).toBeInTheDocument();
    expect(fetchPaginatedProducts).not.toHaveBeenCalled();
  });

  // Note: paginated fallback behavior is covered elsewhere; this suite focuses on search-driven display
});
