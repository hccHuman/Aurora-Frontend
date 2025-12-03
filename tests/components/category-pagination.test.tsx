import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryProductsListComponent from '@/components/tsx/Paginator/CategoryProductsListComponent';

// Mock device service to return a fixed pageSize
jest.mock('@/services/deviceService', () => ({
  getResponsivePageSize: jest.fn(() => 2),
}));

// Mock product service pagination
jest.mock('@/services/productService', () => ({
  fetchPaginatedProductsByCategory: jest.fn(async (categoryId: number, page: number) => {
    if (page === 1) {
      return { data: [
        { id: 1, nombre: 'Prod A', descripcion: '', precio: 10, img_url: '/a.png' },
        { id: 2, nombre: 'Prod B', descripcion: '', precio: 20, img_url: '/b.png' }
      ], total: 4, totalPages: 2, hasNext: true, hasPrev: false };
    }
    return { data: [
      { id: 3, nombre: 'Prod C', descripcion: '', precio: 30, img_url: '/c.png' },
      { id: 4, nombre: 'Prod D', descripcion: '', precio: 40, img_url: '/d.png' }
    ], total: 4, totalPages: 2, hasNext: false, hasPrev: true };
  }),
}));

// Note: searchProductsByCategory will be mocked dynamically in tests where needed

describe('CategoryProductsListComponent pagination', () => {
  it('loads first page and then navigates to second page', async () => {
    render(<CategoryProductsListComponent categoryId={1} />);

    // Wait initial load
    await waitFor(() => expect(screen.getByText(/prod a/i)).toBeInTheDocument());

    // Paginator should show Page indicator e.g. "1 de 2" somewhere
    expect(screen.getByText(/1\s*de\s*2/i)).toBeInTheDocument();

    // Click next
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    // Expect product from second page
    await waitFor(() => expect(screen.getByText(/prod c/i)).toBeInTheDocument());
    expect(screen.getByText(/2\s*de\s*2/i)).toBeInTheDocument();
  });
});

it('shows results from category search when search atom has query', async () => {
  // Mock the search call to return results
  const mockSearch = jest.fn(async (categoryId: number, searchTerm: string, page: number, pageSize: number) => ({
    success: true,
    data: [ { id: 27, nombre: 'Pastillas de Freno Premium Carbono', descripcion: 'x', precio: 75.5, img_url: '/p.png' } ],
    total: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  }));

  // Replace the module mock for searchProductsByCategory
  const svc = require('@/services/productService');
  svc.searchProductsByCategory = mockSearch;

  // prepare atom store with a query
  const initialSearch = { query: 'Carbono', results: [] };
  const { Provider, createStore } = require('jotai');
  const store = createStore();
  store.set(require('@/store/searchStore').searchStateAtom, initialSearch);

  render(
    <Provider store={store}>
      <CategoryProductsListComponent categoryId={1} />
    </Provider>
  );

  // Expect the category search result to appear
  expect(await screen.findByText(/Pastillas de Freno Premium Carbono/i)).toBeInTheDocument();
  // Ensure the paginated endpoint wasn't used
  const { fetchPaginatedProductsByCategory } = require('@/services/productService');
  expect(fetchPaginatedProductsByCategory).not.toHaveBeenCalled();
});
