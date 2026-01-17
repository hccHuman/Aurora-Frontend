import type { ModalProps } from "@/models/FunctionProps/ModalProps";
import ProductCardButton from "../ProductCard/ProductCardButton";
import { useYOLI } from "@/modules/YOLI/injector";

/**
 * ProductModal Component
 *
 * Detailed view of a product in a centered modal overlay.
 * Reuses ProductCardButton for adding to cart functionality.
 *
 * @component
 */
export function ProductModal({ product, open, onClose, lang = "es", loading = false }: ModalProps) {
  const t = useYOLI(lang);
  console.log("🎨 ProductModal Render - Open:", open, "Loading:", loading, "Product:", product);
  if (!open) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid="product-modal-overlay"
      className="fixed inset-0 z-[60] flex items-center justify-center 
                bg-black/80 backdrop-blur-md p-4 transition-opacity animate-in fade-in duration-300"
    >
      <div
        data-testid="product-modal-content"
        className="relative w-full max-w-4xl rounded-2xl 
                  bg-slate-900 shadow-2xl 
                  border border-slate-700 
                  overflow-hidden animate-in zoom-in-95 duration-300 min-h-[400px] flex items-center justify-center"
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-slate-400
                 hover:text-red-400 hover:bg-slate-800/80
                 transition-all text-2xl font-bold p-2 rounded-full bg-slate-800/60 shadow-lg"
          aria-label={t("aria.close")}
          title={t("aria.close")}
        >
          ✕
        </button>

        {loading ? (
          <div className="flex flex-col items-center gap-4 text-white p-12">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-bold tracking-widest">{t("products.loading_products")}</p>
          </div>
        ) : !product ? (
          <div className="flex flex-col items-center gap-4 text-white p-12">
            <p className="text-xl font-bold text-red-400 uppercase tracking-tighter">ERROR: Product not found</p>
            <p className="text-slate-400">Verifica la conexión con el servidor.</p>
          </div>
        ) : (
          /* Two-column layout on desktop, single column on mobile */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full h-full">
            {/* Left: Imagen */}
            <div className="w-full h-64 md:h-full bg-slate-800/50 overflow-hidden flex items-center justify-center p-8">
              {product.img_url ? (
                <img
                  src={product.img_url}
                  alt={product.nombre}
                  className="w-full h-full object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/img/placeholder.svg";
                    target.onerror = null; // Prevent infinite loop
                  }}
                />
              ) : (
                <img
                  src="/img/placeholder.svg"
                  alt="Imagen no disponible"
                  className="w-full h-full object-contain rounded-lg opacity-60"
                />
              )}
            </div>

            {/* Right: Contenido */}
            <div className="p-8 flex flex-col gap-6 justify-between bg-slate-900">
              <div className="flex flex-col gap-4">
                <h4 className="text-3xl font-bold text-slate-50 tracking-tight leading-none">
                  {product.nombre}
                </h4>

                <div className="h-1 w-20 bg-red-500"></div>

                <p className="text-slate-400 leading-relaxed text-base pt-2">
                  {product.descripcion || "Sin descripción disponible."}
                </p>

                <div className="flex items-baseline gap-2 mt-4">
                  <p className="text-5xl font-black text-white italic">
                    {product.precio} <span className="text-red-500 font-bold not-italic text-3xl">€</span>
                  </p>
                </div>
              </div>

              {/* Action button */}
              <div className="flex pt-6">
                <div className="w-full">
                  <ProductCardButton
                    title={product.nombre}
                    id={product.id}
                    price={product.precio}
                    category_id={product.product_category}
                    lang={lang}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
