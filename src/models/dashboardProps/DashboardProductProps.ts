/**
 * Dashboard Product Models
 * 
 * Defines the structure for product management within the 
 * administrative dashboard.
 */

/**
 * A collection of products.
 */
export type Products = Product[];

/**
 * Represents a single product in the dashboard context.
 */
export interface Product {
  id: string;
  /** Display name of the product */
  nombre: string;
  /** Detailed product description, can be null */
  descripcion: string | null;
  /** Current selling price */
  precio: number;
  /** Available inventory count */
  stock: number;
  /** URL to the product image, can be null */
  img_url?: string | null;
  /** ID or name of the associated category */
  product_category: string | number;
  /** Whether the product is currently visible/buyable */
  activo: boolean;
  /** Creation timestamp */
  creado_en: string;
  /** Last update timestamp */
  actualizado_en: string;
}
