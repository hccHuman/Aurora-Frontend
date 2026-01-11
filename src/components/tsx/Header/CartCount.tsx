/**
 * CartCount Component
 *
 * Displays the current number of items in the shopping cart.
 * Supports different visual variants (badge, button, inline).
 * Uses framer-motion for animations when the count changes.
 *
 * @component
 */

import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Display variant for the cart count
 */
type Variant = 'badge' | 'button' | 'inline';

/**
 * Props for the CartCount component
 */
interface Props {
  /** Visual style variant */
  variant?: Variant;
}

export default function CartCount({ variant = 'badge' }: Props) {
  const [cart] = useAtom(cartStore as any);
  const [mounted, setMounted] = useState(false);

  // Evitamos mismatches SSR/CSR
  useEffect(() => setMounted(true), []);

  const total = ((cart as any)?.items || []).reduce((acc: number, it: any) => acc + (it.quantity || 0), 0);

  if (!mounted) return null; // renderizamos solo en cliente

  if (variant === 'button') {
    return (
      <span className="px-3 py-1 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg shadow-sm">
        Carrito ({total})
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <span className="text-sm text-slate-700 dark:text-slate-300">
        Tu carrito tiene {total} artículo{total !== 1 ? 's' : ''}
      </span>
    );
  }

  // badge
  if (total === 0) return (
    <AnimatePresence>
      {/* Nothing to render, but needed for exit animations if total becomes 0 */}
    </AnimatePresence>
  );

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={total}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute -top-2 -right-2 bg-red-600 dark:bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md min-w-[18px] h-[18px] flex items-center justify-center"
        aria-live="polite"
      >
        {total}
      </motion.span>
    </AnimatePresence>
  );
}
