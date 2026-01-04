import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductModalWrapper from '@/components/tsx/Modal/ProductModalWrapper';
import ProductCard from '@/components/tsx/ProductCard/ProductCardComponent';

// Mock the product service used by the wrapper
jest.mock('@/services/productService', () => ({
  getProductById: jest.fn(async (id: number) => ({
    id,
    nombre: `Producto ${id}`,
    descripcion: 'Descripción de prueba',
    precio: 9.99,
    img_url: '/img/test.png',
  })),
}));

describe('Product modal integration', () => {
  it('exposes window.openProductModal after mounting wrapper', async () => {
    render(<ProductModalWrapper />);
    await waitFor(() => expect((window as any).openProductModal).toBeDefined());
    expect(typeof (window as any).openProductModal).toBe('function');
  });

  it('opens modal when ProductCard calls fallback (no prop handler)', async () => {
    render(<ProductModalWrapper />);

    // ensure function available
    await waitFor(() => expect((window as any).openProductModal).toBeDefined());

    // Render a product card without onOpenModal prop to use window fallback
    render(
      <ProductCard id={42} title="Prueba" description="d" price={12} img="/img.png" />
    );

    // Click the 'Ver detalles' button
    const btn = screen.getAllByRole('button', { name: /ver detalles/i })[0];
    fireEvent.click(btn);

    // Modal should show product name returned by mocked getProductById
    await waitFor(() => expect(screen.getByText(/producto 42/i)).toBeInTheDocument());
  });

  it('close button hides modal correctly', async () => {
    render(<ProductModalWrapper />);

    // ensure function available
    await waitFor(() => expect((window as any).openProductModal).toBeDefined());

    render(
      <ProductCard id={101} title="Prueba" description="d" price={12} img="/img.png" />
    );

    const btn = screen.getAllByRole('button', { name: /ver detalles/i })[0];
    fireEvent.click(btn);

    // modal visible
    await waitFor(() => expect(screen.getByText(/producto 101/i)).toBeInTheDocument());

    // close using the X button
    const closeBtn = screen.getByRole('button', { name: /cerrar/i });
    fireEvent.click(closeBtn);

    await waitFor(() => expect(screen.queryByText(/producto 101/i)).not.toBeInTheDocument());
  });

  it('clicking the overlay closes the modal', async () => {
    render(<ProductModalWrapper />);

    // ensure function available
    await waitFor(() => expect((window as any).openProductModal).toBeDefined());

    // open modal
    (window as any).openProductModal(202);

    await waitFor(() => expect(screen.getByText(/producto 202/i)).toBeInTheDocument());

    // click the overlay area - it should close the modal
    const overlay = screen.getByTestId('product-modal-overlay');
    fireEvent.click(overlay);

    await waitFor(() => expect(screen.queryByText(/producto 202/i)).not.toBeInTheDocument());
  });

  it('does not include entrance animation class and image does not use hover-scale', async () => {
    render(<ProductModalWrapper />);
    await waitFor(() => expect((window as any).openProductModal).toBeDefined());

    // open modal
    (window as any).openProductModal(303);
    await waitFor(() => expect(screen.getByText(/producto 303/i)).toBeInTheDocument());

    const content = screen.getByTestId('product-modal-content');
    expect(content.className).not.toContain('animate-fadeIn');

    // ensure the image element doesn't include hover scale class
    const overlay = screen.getByTestId('product-modal-overlay');
    const img = overlay.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.className).not.toMatch(/scale-105|hover:scale-105|transition-transform/);
  });
});
