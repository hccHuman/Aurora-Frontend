/**
 * Payment Service
 *
 * Handles financial transactions and payment intent creation with the backend.
 * Integrates with Stripe/PayPal flows via the server API.
 */
import type { OrderPayload } from "@/models/FunctionProps/OrderPayloadProps";
import { AlbaClient } from "@/modules/ALBA/AlbaClient";
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";
import { PUBLIC_API_URL } from "@/utils/envWrapper";

export const paymentService = {
  /**
   * Submit an order and create a payment intent
   *
   * @async
   * @param {OrderPayload} payload - Order details (total, currency, items)
   * @returns {Promise<any>} Response containing the client secret for payment
   * @throws {Error} If the order fails or the payment is not authorized
   */
  Order: async (payload: OrderPayload): Promise<any> => {
    const API_URL = PUBLIC_API_URL;

    try {
      const res = await AlbaClient.post(`${API_URL}/api/payments/create-payment-intent`, payload);
      return await res.json();
    } catch (err: any) {
      handleInternalError(err);
      throw new Error(err.message || "Error de conexión con el servidor");
    }
  },

  /**
   * Create a payment intent for a list of items (generic helper)
   *
   * @async
   * @param {Array<{ price: number; quantity: number }>} items - List of products to pay for
   * @returns {Promise<any>} Payment intent details
   * @throws {Error} If creation fails or authentication is missing (401)
   */
  createPaymentIntent: async (items: Array<{ price: number; quantity: number }>): Promise<any> => {
    const API_URL = PUBLIC_API_URL;

    try {
      const res = await AlbaClient.post(`${API_URL}/api/payments/create-payment-intent`, { items });
      return await res.json();
    } catch (err: any) {
      handleInternalError(err);
      throw err;
    }
  },
};
