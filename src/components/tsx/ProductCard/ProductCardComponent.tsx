import React from "react";
import { motion } from "framer-motion";
import ProductCardButton from "./ProductCardButton";
import type { ProductCardProps } from "@/models/EcommerceProps/ProductsProps";
import { t } from "@/modules/YOLI/injector";

/**
 * ProductCardReact Component
 *
 * A versatile product card used in various grids and lists.
 * Displays product image, title, description, and price.
 * Provides actions to "Ver detalles" (open modal) and "Añadir al carrito".
 *
 * @component
 */
export default function ProductCardReact({
  id,
  title,
  description,
  price,
  img,
  category_id,
  onOpenModal,
  lang = "es",
}: ProductCardProps & { lang?: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col rounded-xl overflow-hidden shadow-lg bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
      role="article"
      aria-label={title}
    >
      {/* Imagen del producto */}
      <motion.div className="overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          src={img}
          alt={title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/img/placeholder.svg";
            target.onerror = null; // Prevent infinite loop
          }}
        />
      </motion.div>

      {/* Contenido del producto */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex-1">
          <h4 className="text-slate-900 dark:text-slate-100 text-2xl font-semibold mb-2">{title}</h4>
          {description && <p className="text-slate-700 dark:text-slate-300 mb-2 text-sm">{description}</p>}
          {price !== undefined && (
            <p className="text-lg font-bold text-sky-700 dark:text-sky-400">{price} €</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-auto">
          <button
            className="ac-btn ac-btn--primary"
            onClick={() => {
              console.log("🔗 Click en ‘Ver Detalles’ - Producto ID:", id);
              // Prefer explicit prop handler, but fall back to global openProductModal
              if (onOpenModal) {
                console.log("👉 Usando onOpenModal (prop)");
                onOpenModal(id);
              } else if (typeof window !== 'undefined' && (window as any).openProductModal) {
                console.log("👉 Usando window.openProductModal (global)");
                (window as any).openProductModal(id);
              } else {
                console.error("❌ No se encontró la función openProductModal");
              }
            }}
          >
            {t("products.view_details", lang)}
          </button>

          <ProductCardButton title={title} id={id} price={price} category_id={category_id} lang={lang} />
        </div>
      </div>
    </motion.div>
  );
}
