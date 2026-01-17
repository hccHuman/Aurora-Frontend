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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (window as any).openProductModal = async (id: number) => {
      console.log("📦 Abrir Modal para producto ID:", id);
      setOpen(true);
      setLoading(true);
      setProduct(null); // Clear previous product

      try {
        const p = await getProductById(id);
        console.log("✅ Producto recuperado:", p);
        if (!p) {
          console.warn("⚠️ No se encontró el producto o el servicio devolvió null");
        }
        setProduct(p);
      } catch (err) {
        console.error("❌ Error al abrir modal de producto:", err);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setProduct(null);
    setLoading(false);
  };

  return <ProductModal product={product} open={open} onClose={handleClose} lang={lang} loading={loading} />;
}
