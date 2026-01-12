/**
 * Dashboard Category Models
 * 
 * Defines the structure of category data and component props
 * used in the administrative dashboard.
 */

/**
 * Represents a product category in the dashboard.
 */
export interface Category {
  id: string;
  nombre: string;
  activo: boolean;
  /** Language code if applicable */
  lang?: string;
  /** Display title */
  title?: string;
  /** Image path or URL */
  img?: string;
  /** Fully qualified image URL */
  img_url?: string;
  /** Last update timestamp */
  actualizado_en?: string;
  /** Creation timestamp */
  creado_en?: string;
}

/**
 * Props for the dashboard categories list component.
 */
export interface CategoriesListProps {
  /** Optional header title for the block */
  title?: string;
  /** Initial page index (1-indexed) */
  initialPage?: number;
  /** Forced page size (overrides responsive calculation) */
  pageSizeOverride?: number;
  /** Whether to hide action buttons (Create/Edit/Delete) */
  readOnly?: boolean;
  /** Callback triggered after a category is successfully saved */
  onSaved?: (categoryId: string) => void;
  /** Callback triggered after a category is successfully deleted */
  onDeleted?: (categoryId: string) => void;
}