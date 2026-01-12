/**
 * Env Wrapper Utility
 *
 * Provides a safe way to access environment variables that works in both
 * Vite/Astro (import.meta.env) and Jest/Node (process.env).
 */

/**
 * Retrieves an environment variable by name.
 * Handles different environment contexts (browser/node).
 *
 * @param {string} name - The name of the environment variable
 * @returns {string | undefined} The variable value or undefined
 */
export const getEnv = (name: string): string | undefined => {
    // Vite/Astro standard access (handled by static replacement at build time)
    // We use casting as Record to avoid TS errors on dynamic access
    const value = (import.meta.env as Record<string, any>)[name];
    if (value) return value;

    // Fallback for Node-like environments (if not mocked)
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
        return process.env[name];
    }

    return undefined;
};

/**
 * Public API URL configured via environment variables.
 * Defaults to localhost:3000 if not set.
 *
 * @type {string}
 */
export const PUBLIC_API_URL = getEnv("PUBLIC_API_URL") || "http://localhost:3000";
