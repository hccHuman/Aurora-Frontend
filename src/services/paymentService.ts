/**
 * Payment Service
 *
 * Handles financial transactions and payment intent creation with the backend.
 * Integrates with Stripe/PayPal flows via the server API.
 */
import type { OrderPayload } from "@/models/FunctionProps/OrderPayloadProps";
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
      const res = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        let errorData: any = null;
        try {
          errorData = await res.json();
        } catch {
          throw new Error(`Error HTTP ${res.status}`);
        }

        if (errorData?.code) {
          handleInternalError(errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        throw new Error(`Error HTTP ${res.status}`);
      }

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
      const res = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        let errData: any = null;
        try {
          errData = await res.json();
        } catch { }

        if (res.status === 401) {
          const e: any = new Error(errData?.message || 'Unauthorized');
          e.status = 401;
          handleInternalError(errData || { message: 'Unauthorized', status: 401, code: 401 });
          throw e;
        }

        handleInternalError(errData || { message: `Payment intent HTTP ${res.status}`, code: res.status });
        const e: any = new Error(errData?.message || `Error creating payment intent: ${res.status}`);
        e.status = res.status;
        throw e;
      }

      return await res.json();
    } catch (err: any) {
      handleInternalError(err);
      throw err;
    }
  },
};
