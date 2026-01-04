/**
 * PayPal Order Payload Model
 *
 * Data structure for initiating PayPal payment orders.
 * Used to send order total and currency to PayPal API.
 */

/**
 * OrderPayload - Payment order information
 *
 * Contains pricing information for a purchase order to be processed
 * through PayPal. Sent to PayPal API to create and authorize payment.
 *
 * @interface OrderPayload
 * @property {string} total - Total order amount as string (e.g., "99.99")
 * @property {string} currency - ISO 4217 currency code (e.g., "USD", "EUR", "MXN")
 *
 * @example
 * const order: OrderPayload = {
 *   total: "149.99",
 *   currency: "USD"
 * }
 *
 * const orderMXN: OrderPayload = {
 *   total: "2500.00",
 *   currency: "MXN"
 * }
 */
export interface OrderPayload {
  total: string;
  currency: string;
}
