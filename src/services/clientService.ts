/**
 * Client Service
 *
 * Handles user authentication and profile management including login,
 * registration, token refresh, and logout.
 */
import type { LoginPayload, LoginResponse, Profile, RegisterPayload, RegisterResponse } from "@/models/EcommerceProps/UserProps";
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";
import { PUBLIC_API_URL } from "@/utils/envWrapper";

export const clientService = {
  /**
   * Authenticate a user with email and password
   *
   * @param {LoginPayload} payload - User credentials (email and password)
   * @returns {Promise<LoginResponse>} Auth tokens (accessToken and refreshToken)
   * @throws {Error} If authentication fails
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const API_URL = PUBLIC_API_URL;
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
   * Register a new user
   *
   * @param {RegisterPayload} payload - New user details
   * @returns {Promise<RegisterResponse>} Confirmation message and user profile
   * @throws {Error} If registration fails
   */
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const API_URL = PUBLIC_API_URL;

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
   * Refresh the access token using the refresh token cookie
   *
   * @async
   * @returns {Promise<{ accessToken: string }>} Object containing the new access token
   * @throws {Error} If token refresh fails
   */
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const API_URL = PUBLIC_API_URL;
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
          handleInternalError(errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        throw new Error(`Error HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      handleInternalError(err);
      throw new Error(err.message || "Error al refrescar token");
    }
  },

  /**
   * Log out the current user by clearing the cookies on the server
   *
   * @async
   * @returns {Promise<{ message: string }>} Logout confirmation message
   * @throws {Error} If logout fails
   */
  logout: async (): Promise<{ message: string }> => {
    const API_URL = PUBLIC_API_URL;
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
          handleInternalError(errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        throw new Error(`Error HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      handleInternalError(err);
      throw new Error(err.message || "Error de conexión al cerrar sesión");
    }
  },

  /**
   * Fetch the current user profile details
   *
   * @async
   * @returns {Promise<Profile>} User profile data
   * @throws {Error} If fetching profile fails
   */
  getProfile: async (): Promise<Profile> => {
    const API_URL = PUBLIC_API_URL;
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
          handleInternalError(errorData);
          throw new Error(errorData.message || `Error interno ${errorData.code}`);
        }

        throw new Error(`Error HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      handleInternalError(err);
      throw new Error(err.message || "Error al obtener el perfil del usuario");
    }
  },

  /**
   * Get information about the currently authenticated user session
   *
   * @async
   * @returns {Promise<{ user: Profile | null }>} Object containing the user profile or null if not authenticated
   * @throws {Error} If an unexpected error occurs during the session check
   */
  me: async (): Promise<{ user: Profile }> => {
    const API_URL = PUBLIC_API_URL;
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
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
        } catch { }

        if (res.status === 401) {
          return { user: null } as any;
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
      throw new Error(err.message || "Error al obtener datos de /auth/me");
    }
  },
};
