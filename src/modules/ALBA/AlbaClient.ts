import { handleInternalError, type BackendError } from "./ErrorHandler";
import { clientService } from "@/services/clientService";

/**
 * ALBA Client - Enhanced Fetch Wrapper
 *
 * Intercepts responses to check for logical backend errors based on the pact
 * { status, error, code }. Dispatches errors to the global handler.
 * Now supports auto-refresh on 401 and redirect to login on failure.
 */
export class AlbaClient {
    /**
     * Wrapper around global fetch
     *
     * @static
     * @async
     * @param {RequestInfo | URL} input - Request URL or info object
     * @param {RequestInit} [init] - Fetch options (method, headers, body, etc.)
     * @returns {Promise<Response>} The fetch response
     * @throws {Error} If a network error occurs or the backend returns an error pact
     */
    static async fetch(input: RequestInfo | URL, init?: RequestInit & { skipRedirect?: boolean }): Promise<Response> {
        const fetchInit: RequestInit = {
            credentials: 'include',
            ...init
        };

        try {
            let response = await fetch(input, fetchInit);

            // AUTO-REFRESH LOGIC
            if (response.status === 401) {
                // Prevent infinite loops if the refresh endpoint itself is being called
                const urlString = input.toString();
                if (!urlString.includes("/auth/refresh") && !urlString.includes("/auth/login") && !urlString.includes("/auth/me")) {
                    console.warn("🔒 401 Detectado. Intentando refrescar token...");
                    try {
                        // Attempt to refresh
                        await clientService.refreshToken();
                        console.log("✅ Token refrescado. Reintentando petición original...");

                        // Retry the original request
                        response = await fetch(input, fetchInit);
                    } catch (refreshError) {
                        if (!init?.skipRedirect) {
                            console.error("❌ Fallo al refrescar token. Redirigiendo a login...", refreshError);
                            if (typeof window !== "undefined") {
                                // Extract locale from current path (e.g., /en/dashboard -> /en)
                                const pathSegments = window.location.pathname.split('/').filter(Boolean);
                                const currentLocale = pathSegments[0] === 'en' || pathSegments[0] === 'es' ? pathSegments[0] : 'es'; // Default to 'es' if not found

                                window.location.href = `/${currentLocale}/account/login`;
                            }
                        }
                        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
                    }
                }
            }

            // Clone response to read body without consuming it for the caller
            // In test environments (Jest), response.clone() might not exist
            let clone: Response;
            if (typeof response.clone === 'function') {
                clone = response.clone();
            } else {
                // Fallback for test environments - just use the response directly
                clone = response;
            }

            try {
                const body = await clone.json();

                // Check if body matches error signature
                if (body && typeof body === 'object' && 'code' in body && 'status' in body) {
                    if (body.error || !response.ok) {
                        handleInternalError(body as BackendError);
                        throw new Error(body.error || `Error ${body.code}`);
                    }
                }
            } catch (e) {
                // Body was not JSON or parsing failed, but if response is not OK, we still handle it
                if (!response.ok) {
                    handleInternalError({
                        status: response.status,
                        code: response.status, // Fallback code
                        error: response.statusText,
                    });
                }
            }

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`);
            }

            return response;
        } catch (error) {
            // Network errors (offline, etc)
            handleInternalError(error);
            throw error;
        }
    }

    /**
     * Helper for POST requests
     *
     * @static
     * @async
     * @param {string} url - Target URL
     * @param {any} body - Request payload (will be stringified)
     * @param {HeadersInit} [headers={"Content-Type": "application/json"}] - Headers
     * @returns {Promise<Response>} The fetch response
     */
    static async post(url: string, body: any, headers: HeadersInit = { "Content-Type": "application/json" }, init?: RequestInit & { skipRedirect?: boolean }) {
        return this.fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            ...init
        });
    }

    /**
     * Helper for GET requests
     *
     * @static
     * @async
     * @param {string} url - Target URL
     * @param {HeadersInit} [headers={"Content-Type": "application/json"}] - Headers
     * @returns {Promise<Response>} The fetch response
     */
    static async get(url: string, headers: HeadersInit = { "Content-Type": "application/json" }, init?: RequestInit & { skipRedirect?: boolean }) {
        return this.fetch(url, {
            method: "GET",
            headers,
            ...init
        });
    }
}
