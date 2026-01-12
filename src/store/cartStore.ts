/**
 * Shopping Cart Global State Store
 *
 * Jotai atom for managing shopping cart state across the entire application.
 * Tracks items added to cart for checkout and purchase.
 *
 * Jotai provides lightweight, atomic state management without Redux boilerplate.
 */

import { atom } from "jotai";

/**
 * Cart Items State Atom (persisted to sessionStorage)
 *
 * This implementation initializes from sessionStorage (if available)
 * and persists any updates to sessionStorage under the key `aurora_cart`.
 * Components may read/write `cartStore` as before; writes will also update
 * sessionStorage automatically.
 */
const STORAGE_KEY = "aurora_cart";

/**
 * Read the cart state from sessionStorage
 *
 * @returns {any} The cart object from storage or empty items array
 */
function readSessionCart() {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    // ignore parse/storage errors
  }
  return { items: [] };
}

const baseAtom = atom(readSessionCart());

export const cartStore = atom(
  (get) => get(baseAtom),
  (get, set, update: any) => {
    // Allow functional or direct updates
    // Ensure we always operate on a valid cart object
    const current = get(baseAtom) ?? { items: [] };
    const next = typeof update === "function" ? update(current) : update;

    set(baseAtom, next);

    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        // Persist a normalized cart object
        const safeNext = next ?? { items: [] };
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeNext));
      }
    } catch (e) {
      // ignore storage errors silently
    }
  }
);
