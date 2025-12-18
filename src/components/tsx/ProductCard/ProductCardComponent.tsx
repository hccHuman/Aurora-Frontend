import React from "react";
import ProductCardButton from "./ProductCardButton";
import type { ProductCardProps } from "@/models/EcommerceProps/ProductsProps";

export default function ProductCardReact({
  id,
  title,
  description,
  price,
  img,
  onOpenModal,
}: ProductCardProps) {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Imagen del producto */}
      <img src={img} alt={title} className="w-full h-48 object-cover" />

      {/* Contenido del producto */}
      <div className="p-6 flex flex-col gap-4">
        <div>
          <h4 className="text-slate-900 dark:text-slate-100 text-2xl font-semibold mb-2">{title}</h4>
          {description && <p className="text-slate-700 dark:text-slate-300 mb-2 text-sm">{description}</p>}
          {price !== undefined && (
            <p className="text-lg font-bold text-sky-700 dark:text-sky-400">{price} €</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center">
          <button
            className="ac-btn ac-btn--primary"
            onClick={() => {
              // Prefer explicit prop handler, but fall back to global openProductModal
              if (onOpenModal) {
                onOpenModal(id);
              } else if (typeof window !== 'undefined' && (window as any).openProductModal) {
                (window as any).openProductModal(id);
              }
            }}
          >
            Ver detalles
          </button>

          <ProductCardButton title={title} id={id} price={price} />
        </div>
      </div>
    </div>
  );
}
