/**
 * Environment Configuration Module
 *
 * Centralized configuration for all environment variables used throughout the application.
 * This module validates that required environment variables are defined at runtime.
 *
 * All environment variables must be prefixed with PUBLIC_ to be accessible in the browser.
 * Variables are loaded from .env files at build time.
 */

/**
 * Helper function to safely retrieve environment variables
 *
 * @param name - The environment variable name
 * @param defaultValue - Optional fallback value if variable is not defined
 * @returns The environment variable value or default value
 * @throws Error if variable is not defined and no default provided
 */
function getEnvVariable(name: string, defaultValue?: string): string {
  // Attempt to retrieve the environment variable from import.meta.env
  const value = (import.meta.env as Record<string, string>)[name];

  // If variable doesn't exist, check for default value
  if (!value) {
    if (defaultValue !== undefined) return defaultValue;
    // Throw error if both variable and default are missing
    throw new Error(`Environment variable "${name}" is not defined.`);
  }
  return value;
}

/**
 * Global environment configuration object
 *
 * Contains all configuration values needed by the application:
 * - API endpoints for backend communication
 * - AI service credentials (LUCIA, ANA)
 * - Payment service credentials (Stripe)
 * - Application runtime environment
 */
export const ENV = {
  // ===== BACKEND API =====
  /** Base URL for all backend API calls */
  API_URL: getEnvVariable("PUBLIC_API_URL"),



  // ===== APPLICATION ENVIRONMENT =====
  /** Current runtime environment: 'development' or 'production' */
  NODE_ENV: getEnvVariable("NODE_ENV", "development") as "development" | "production",
};