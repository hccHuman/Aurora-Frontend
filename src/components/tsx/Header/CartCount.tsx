import React from 'react';
import { useAtom } from 'jotai';
import { cartStore } from '@/store/cartStore';

type Variant = 'badge' | 'button' | 'inline';

interface Props {
  variant?: Variant;
}

export default function CartCount({ variant = 'badge' }: Props) {
  const [cart] = useAtom(cartStore as any);

  const total = (cart?.items || []).reduce((acc: number, it: any) => acc + (it.quantity || 0), 0);

  if (variant === 'button') {
    return <>{`Carrito (${total})`}</>;
  }

  if (variant === 'inline') {
    return <>{`Tu carrito tiene ${total} artículo(s)`}</>;
  }

  // badge
  if (total === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-red-600 dark:bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full" aria-live="polite">
      {total}
    </span>
  );
}
