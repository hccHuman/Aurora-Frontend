/**
 * Pagination Interface
 * 
 * Standard interface for pagination state and control.
 * Used by UI components like `Paginator` or `Pagination` to manage page switching.
 */
export interface Pagination {
  /** The initial page number to display (1-indexed) */
  initialPage?: number;
  /** The total number of pages available */
  totalPages: number;
  /** Callback function triggered when a new page is selected */
  onPageChange: (page: number) => void;
}