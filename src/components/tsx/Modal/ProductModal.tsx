import type { ModalProps } from "@/models/FunctionProps/ModalProps";
import ProductCardButton from "../ProductCard/ProductCardButton";

/**
 * ProductModal Component
 *
 * Detailed view of a product in a centered modal overlay.
 * Reuses ProductCardButton for adding to cart functionality.
 *
 * @component
 */
export function ProductModal({ product, open, onClose }: ModalProps) {
  if (!open || !product) return null;

  return (
    <div
      onClick={(e) => {
        // close when clicking the backdrop (only when clicking the overlay itself)
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid="product-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center 
                bg-black/70 backdrop-blur-sm p-4 transition-opacity animate-in fade-in duration-300"
    >
      <div
        data-testid="product-modal-content"
        className="relative w-full max-w-4xl rounded-2xl 
                  bg-slate-900/95 backdrop-blur-xl shadow-2xl 
                  border border-slate-700/50 
                  overflow-hidden animate-in zoom-in-95 duration-300"
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-slate-400
                 hover:text-red-400 hover:bg-slate-800/80
                 transition-all text-2xl font-bold p-2 rounded-full bg-slate-800/60 shadow-lg"
          aria-label="Cerrar"
          title="Cerrar"
        >
          ✕
        </button>

        {/* Two-column layout on desktop, single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: Imagen */}
          {product.img_url && (
            <div className="w-full h-64 md:h-full bg-slate-800/50 overflow-hidden flex items-center justify-center p-8">
              <img
                src={product.img_url}
                alt={product.nombre}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}

          {/* Right: Contenido */}
          <div className="p-8 flex flex-col gap-6 justify-between">
            <div className="flex flex-col gap-4">
              <h4 className="text-3xl font-bold text-slate-100 tracking-tight">
                {product.nombre}
              </h4>

              <p className="text-slate-300 leading-relaxed text-base">
                {product.descripcion}
              </p>

              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-4xl font-extrabold text-red-400">
                  {product.precio} €
                </p>
              </div>
            </div>

            {/* Action button */}
            <div className="flex gap-3">
              <ProductCardButton title={product.nombre} id={product.id} category_id={product.product_category} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
