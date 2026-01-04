// src/services/paymentService.ts
import type { OrderPayload } from "@/models/FunctionProps/OrderPayloadProps";
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";

function getEnv() {
  if (typeof window !== "undefined" && (window as any).ENV) {
    return (window as any).ENV;
  }

  // Safe access to process.env (may be undefined in the browser)
  if (typeof process !== "undefined" && process?.env) {
    return {
      API_URL: (process.env.PUBLIC_API_URL as string) || "",
    };
  }

  // Fallback - empty API URL to avoid ReferenceError in client-side code
  // Default to the known backend server so frontend can work even when ENV isn't populated
  return { API_URL: "https://aurora-back-qsx9.onrender.com" };
}

export const paymentService = {
  Order: async (payload: OrderPayload): Promise<any> => {
    const { API_URL } = getEnv();

    try {
      const res = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        // 🧩 Intentar leer el código interno desde la respuesta
        let errorData: any = null;
        try {
          errorData = await res.json();
        } catch {
          throw new Error(`Error HTTP ${res.status}`);
        }

        // Si el backend te devuelve algo como { code: 703, message: "PAYMENT_NOT_AUTHORIZED" }
        if (errorData?.code) {
          handleInternalError(errorData.code, errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        // Si no hay código interno, lanzar error HTTP genérico
        throw new Error(`Error HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      // 🌐 Error de red, servidor caído, etc.
      handleInternalError("800", { message: "EXTERNAL_SERVICE_ERROR", details: err.message });
      throw new Error(err.message || "Error de conexión con el servidor");
    }
  },
  createPaymentIntent: async (items: Array<{ price: number; quantity: number }>): Promise<any> => {
    const { API_URL } = getEnv();

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
        } catch {}
        // If the backend returned 401, create a specialized error carrying the status
        if (res.status === 401) {
          const e: any = new Error(errData?.message || 'Unauthorized');
          e.status = 401;
          handleInternalError("401", errData || { message: 'Unauthorized' });
          throw e;
        }

        handleInternalError("700", errData || { message: `Payment intent HTTP ${res.status}` });
        const e: any = new Error(errData?.message || `Error creating payment intent: ${res.status}`);
        e.status = res.status;
        throw e;
      }

      return await res.json();
    } catch (err: any) {
      handleInternalError("800", { message: "EXTERNAL_SERVICE_ERROR", details: err.message });
      throw err;
    }
  },
};
