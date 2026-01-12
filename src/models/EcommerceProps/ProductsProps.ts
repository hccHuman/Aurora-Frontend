/**
 * Product Data Models
 * 
 * Defines the structure of product data and component props
 * used throughout the e-commerce store implementation.
 */

/**
 * Basic product card data structure.
 */
export interface ProductCard {
  id: string;
  nombre: string;
  img_url: string;
  descripcion: string;
  precio: number;
  category_id: number;
}

/**
 * Represents a paginated response from the products API.
 */
export interface PaginatedProducts {
  /** Array of products for the current page */
  data: any[];
  /** Total number of products across all pages */
  total: number;
  /** Total number of pages available */
  totalPages: number;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrev: boolean;
}

/**
 * Props for the ProductCard component.
 */
export interface ProductCardProps {
  id: number;
  title: string;
  description?: string;
  price?: number;
  img: string;
  category_id?: number;
  /** Optional callback to open the product details modal */
  onOpenModal?: (id: number) => void;
}

/**
 * Detailed product information model.
 */
export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  img_url: string;
  category_id?: number;
  product_category: number;
}

/**
 * Props for the main product list containers.
 */
export interface AllProductsListProps {
  /** Current language code */
  lang?: string;
  /** Optional callback to open the product details modal */
  onOpenModal?: (id: number) => void;
}