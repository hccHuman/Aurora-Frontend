import { handleInternalError, type BackendError } from "./ErrorHandler";

/**
 * ALBA Client - Enhanced Fetch Wrapper
 *
 * Intercepts responses to check for logical backend errors based on the pact
 * { status, error, code }. Dispatches errors to the global handler.
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
    static async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        try {
            const response = await fetch(input, init);

            // Clone response to read body without consuming it for the caller
            const clone = response.clone();

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
    static async post(url: string, body: any, headers: HeadersInit = { "Content-Type": "application/json" }) {
        return this.fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
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
    static async get(url: string, headers: HeadersInit = { "Content-Type": "application/json" }) {
        return this.fetch(url, {
            method: "GET",
            headers,
        });
    }
}
