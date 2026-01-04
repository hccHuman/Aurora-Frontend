import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartStore } from '@/store/cartStore';

type Variant = 'badge' | 'button' | 'inline';

interface Props {
  variant?: Variant;
}

export default function CartCount({ variant = 'badge' }: Props) {
  const [cart] = useAtom(cartStore as any);
  const [mounted, setMounted] = useState(false);

  // Evitamos mismatches SSR/CSR
  useEffect(() => setMounted(true), []);

  const total = (cart?.items || []).reduce((acc: number, it: any) => acc + (it.quantity || 0), 0);

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
  if (total === 0) return null;

  return (
    <span
      className="absolute -top-2 -right-2 bg-red-600 dark:bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-md"
      aria-live="polite"
    >
      {total}
    </span>
  );
}
