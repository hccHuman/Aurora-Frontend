import { useState } from "react";
import { motion } from 'framer-motion';
import type { ButtonProps } from "@/models/SystemProps/ButonProps";
import { useAtom } from 'jotai';
import { cartStore } from '@/store/cartStore';
import { t } from "@/modules/YOLI/injector";

/**
 * ProductCardButton Component
 *
 * A specialized button for adding products to the shopping cart.
 * Handles local "adding" state for visual feedback and updates the global cartStore.
 *
 * @component
 */
export default function ProductCardButton({ title, id, price, category_id, lang = "es" }: ButtonProps & { price?: number, lang?: string }) {
  const [, setCart] = useAtom(cartStore);
  const [isAdding, setIsAdding] = useState(false);

  function addToCart() {
    setIsAdding(true);
    setCart((prev: any) => {
      const existing = prev.items.find((it: any) => it.productId === id);
      if (existing) {
        return { items: prev.items.map((it: any) => it.productId === id ? { ...it, quantity: it.quantity + 1 } : it) };
      }
      return { items: [...prev.items, { productId: id, title, price: price ?? 0, quantity: 1, category_id }] };
    });

    setTimeout(() => setIsAdding(false), 1000);
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={addToCart}
      className={`text-sm text-white px-4 py-2 rounded transition shadow-sm ${isAdding
        ? "bg-green-600 dark:bg-green-500"
        : "bg-red-600 dark:bg-red-500 hover:bg-red-500 dark:hover:bg-red-400"
        }`}
      aria-label={t("products.aria_add_to_cart", lang).replace("{title}", title)}
    >
      {isAdding ? t("products.added", lang) : t("products.add_to_cart", lang)}
    </motion.button>
  );
}
