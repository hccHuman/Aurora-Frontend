/**
 * Dashboard Order Models
 * 
 * Defines the structure of order data and API responses
 * for the administrative dashboard's order management.
 */

/**
 * Represents a single sales order in the dashboard list.
 */
export type Order = {
  /** Transaction ID or reference */
  transaction: string;
  /** ISO date string of the transaction */
  datetime: string;
  /** Monetary amount of the transaction */
  amount: string | number;
  /** Unique reference number */
  reference: string;
  /** Payment method used (e.g., "PayPal", "Stripe") */
  method: string;
  /** Current status of the order (e.g., "completed", "pending") */
  status: string;
};

/**
 * Paginated response for order lists.
 */
export interface OrdersResponse {
  /** Array of orders for the current page */
  data: Order[];
  /** Current page number */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items across all pages */
  total: number;
  /** Total number of pages available */
  totalPages: number;
}