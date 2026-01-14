import React, { useState, useEffect } from "react";
import { ProductModal } from "./ProductModal";
import { getProductById } from "@/services/productService";
import type { Lang } from "@/models/SystemProps/LangProps";

/**
 * ProductModalWrapper Component
 *
 * Global singleton wrapper for the ProductModal.
 * Exposes a global window function `openProductModal(id)` to trigger
 * the modal from anywhere in the application (even from non-React code).
 *
 * @component
 */
export default function ProductModalWrapper({ lang = "es" }: Lang) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    (window as any).openProductModal = async (id: number) => {
      const p = await getProductById(id);
      setProduct(p);
      setOpen(true);
    };
  }, []);

  // Ensure we also clear the product when the modal closes to avoid stale content
  const handleClose = () => {
    setOpen(false);
    setProduct(null);
  };

  return <ProductModal product={product} open={open} onClose={handleClose} lang={lang} />;
}
