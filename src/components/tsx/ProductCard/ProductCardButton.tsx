/**
 * Product Card Button Component
 *
 * Simple button for adding products to shopping cart.
 * Currently logs action to console; future enhancement will integrate
 * with cart store for actual cart management.
 */

import type { ButtonProps } from "@/models/SystemProps/ButonProps";
import { useAtom } from 'jotai';
import { cartStore } from '@/store/cartStore';

/**
 * ProductCardButton - Add to cart button for product cards
 *
 * Displays styled button that triggers product addition to cart.
 *
 * @component
 * @param props - Button properties
 * @param props.title - Product name (logged when added)
 * @param props.id - Product ID (logged when added)
 * @returns JSX.Element - Styled button with hover effects
 *
 * @example
 * <ProductCardButton title="Laptop" id={123} />
 * // On click: Logs "Añadido al carrito: Laptop (ID: 123)"
 */
export default function ProductCardButton({ title, id, price }: ButtonProps & { price?: number }) {
  const [, setCart] = useAtom(cartStore);
  /**
   * Handle add to cart action
   *
   * Currently logs the action to console for debugging.
   * Future implementation should:
   * - Call cart store mutation to add item
   * - Update cart count in UI
   * - Show success notification to user
   */
  function addToCart() {
    setCart((prev: any) => {
      const existing = prev.items.find((it: any) => it.productId === id);
      if (existing) {
        // increment quantity
        return { items: prev.items.map((it: any) => it.productId === id ? { ...it, quantity: it.quantity + 1 } : it) };
      }
      return { items: [...prev.items, { productId: id, title, price: price ?? 0, quantity: 1 }] };
    });
    // simple feedback
    console.log(`Añadido al carrito: ${title} (ID: ${id})`);
  }

  return (
    <button
      onClick={addToCart}
      className="text-sm text-white bg-red-600 dark:bg-red-500 px-4 py-2 rounded hover:bg-red-500 dark:hover:bg-red-400 transition"
      aria-label={`Añadir ${title} al carrito`}
    >
      Añadir al carrito
    </button>
  );
}
