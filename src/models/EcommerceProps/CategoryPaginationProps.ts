/**
 * Category Pagination Interface
 * 
 * Defines the configuration for category listing pagination.
 * Used by components that fetch and display products by category with pagination.
 */
export interface Category {
  /** The current language code (e.g., "es", "en") */
  lang: string;
  /** Optional number of products to show per page */
  pageSize?: number;
}