// src/services/clientService.ts
import type { LoginPayload, LoginResponse, Profile, RegisterPayload, RegisterResponse } from "@/models/EcommerceProps/UserProps";

import { handleInternalError } from "@/modules/ALBA/ErrorHandler";

function getEnv() {
  if (typeof window !== "undefined" && window.ENV) {
    return window.ENV;
  }
  return {
    API_URL: import.meta.env.PUBLIC_API_URL,
  };
}

export const clientService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { API_URL } = getEnv();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
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
          handleInternalError(errorData.code, errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        throw new Error(`Error HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      handleInternalError("800", { message: "EXTERNAL_SERVICE_ERROR", details: err.message });
      throw new Error(err.message || "Error de conexión con el servidor");
    }
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { API_URL } = getEnv();

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorData: any = null;

        try {
          errorData = await res.json();
        } catch {
          throw new Error(`Error HTTP ${res.status}`);
        }

        if (errorData?.code) {
          handleInternalError(errorData.code, errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        throw new Error(`Error HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      handleInternalError("800", { message: "EXTERNAL_SERVICE_ERROR", details: err.message });
      throw new Error(err.message || "Error de conexión con el servidor");
    }
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const { API_URL } = getEnv();
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        let errorData: any = null;
        try {
          errorData = await res.json();
        } catch {
          throw new Error(`Error HTTP ${res.status}`);
        }

        if (errorData?.code) {
          handleInternalError(errorData.code, errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        throw new Error(`Error HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      handleInternalError("800", { message: "EXTERNAL_SERVICE_ERROR", details: err.message });
      throw new Error(err.message || "Error al refrescar token");
    }
  },

  logout: async (): Promise<{ message: string }> => {
    const { API_URL } = getEnv();
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        let errorData: any = null;
        try {
          errorData = await res.json();
        } catch {
          throw new Error(`Error HTTP ${res.status}`);
        }

        if (errorData?.code) {
          handleInternalError(errorData.code, errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        throw new Error(`Error HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      handleInternalError("800", { message: "EXTERNAL_SERVICE_ERROR", details: err.message });
      throw new Error(err.message || "Error de conexión al cerrar sesión");
    }
  },

  //ya veremos si lo usamos
  getProfile: async (): Promise<Profile> => {
    const { API_URL } = getEnv();
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        let errorData: any = null;
        try {
          errorData = await res.json();
        } catch {
          throw new Error(`Error HTTP ${res.status}`);
        }

        if (errorData?.code) {
          handleInternalError(errorData.code, errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        throw new Error(`Error HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      handleInternalError("800", { message: "EXTERNAL_SERVICE_ERROR", details: err.message });
      throw new Error(err.message || "Error al obtener el perfil del usuario");
    }
  },
  me: async (): Promise<{ user: Profile }> => {
    const { API_URL } = getEnv();
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "POST", // o GET si tu backend permite GET
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Muy importante para enviar cookies HttpOnly
        body: JSON.stringify({}), // si usas POST, sino eliminar en GET
      });

      // Si la respuesta indica que no hay sesión válida (401), devolvemos
      // { user: null } silenciosamente para que el consumidor (LoginReader)
      // pueda manejar el estado sin que se imprima un error en consola.
      if (!res.ok) {
        // Intentamos parsear el body para obtener detalles (no obligatorio)
        let errorData: any = null;
        try {
          errorData = await res.json();
        } catch {}

        // Si es un 401 (token inválido o expirado), devolvemos un objeto vacío
        // en lugar de lanzar una excepción que luego se vea como error en consola.
        if (res.status === 401) {
          return { user: null } as any;
        }

        // Para otros errores, usamos el sistema de errores internos si viene código
        if (errorData?.code) {
          handleInternalError(errorData.code, errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        throw new Error(`Error HTTP ${res.status}`);
      }

      return await res.json(); // aquí recibirás { response: 200, user: { ... } }
    } catch (err: any) {
      // Si ocurre un error de red u otro error inesperado, registrarlo en ALBA
      // y propagar la excepción para que el caller pueda reaccionar.
      handleInternalError("800", { message: "EXTERNAL_SERVICE_ERROR", details: err.message });
      throw new Error(err.message || "Error al obtener datos de /auth/me");
    }
  },
};
