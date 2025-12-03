import type { Modal } from "@/models/FunctionProps/ModalProps";
import ProductCardButton from "../ProductCard/ProductCardButton";

export function ProductModal({ product, open, onClose }: Modal) {
  if (!open || !product) return null;

  return (
    <div
      onClick={(e) => {
        // close when clicking the backdrop (only when clicking the overlay itself)
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid="product-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center 
                bg-black/60 backdrop-blur-sm p-4 transition-opacity"
    >
      <div
        data-testid="product-modal-content"
        className="relative w-full max-w-lg rounded-2xl 
                  bg-white dark:bg-gray-900 shadow-2xl 
                  border border-gray-200 dark:border-gray-700 
                  overflow-hidden"
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 text-gray-600 dark:text-gray-300 
                 hover:text-red-500 dark:hover:text-red-400 
                 transition-colors text-xl font-bold p-3 rounded-full bg-white/80 dark:bg-gray-800/60 shadow-sm"
          aria-label="Cerrar"
          title="Cerrar"
        >
          ✕
        </button>

        {/* Imagen */}
        {product.img_url && (
          <div className="w-full h-48 sm:h-60 md:h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
            <img
              src={product.img_url}
              alt={product.nombre}
              // object-contain ensures the image stays within the allotted space and won't scale up
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Contenido */}
        <div className="p-6 flex flex-col gap-3">
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{product.nombre}</h4>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.descripcion}</p>

          <p
            className="mt-2 text-3xl font-extrabold 
                    text-sky-600 dark:text-sky-300"
          >
            {product.precio} €
          </p>
          <ProductCardButton title={product.nombre} id={product.id} />
        </div>
      </div>
    </div>
  );
}
