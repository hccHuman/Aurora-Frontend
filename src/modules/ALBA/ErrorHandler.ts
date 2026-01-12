/**
 * ALBA Error Handler - Internal Error Management System
 *
 * Centralized error handling for internal application errors (HTTP status codes 600+).
 * Provides error code lookup, error categorization, and console-based error reporting.
 * Designed for extensibility to future remote logging, error dispatch, or UI integration.
 *
 * Error Categories:
 * - 800-899: Chat service errors (backend timeouts, message failures)
 * - 801-899: API errors (product/category fetch failures, validation errors)
 * - 600+: Internal processing errors
 */

import { ERROR_CODES } from "@/modules/ALBA/data/ErrorCodes";
import { dispatchToast } from "@/modules/ALBA/store/toastStore";
import type { ErrorCategories } from "@/modules/ALBA/models/ErrorCategories";

// Pact definition with Backend
export interface BackendError {
  status: number;
  error: string;
  code: number;
}

/**
 * Get human-readable error name from a code by searching all categories.
 *
 * @param {number | string} code - The error code to look up
 * @returns {string} The formatted category and error name, or UNKNOWN_ERROR_CODE
 */
export function getErrorName(code: number | string): string {
  for (const [category, errors] of Object.entries(ERROR_CODES) as [
    ErrorCategories,
    Record<string, string>,
  ][]) {
    if (errors[code]) {
      return `${category}.${errors[code]}`;
    }
  }
  return `UNKNOWN_ERROR_CODE_${code}`;
}

/**
 * Main Error Handler Entrypoint
 *
 * Inspects the error object, determines the type (Backend Pact, System Error, or Fallback),
 * and executes reactions like logging to console and dispatching a UI Toast.
 *
 * @param {any} error - The error object to handle
 */
export function handleInternalError(error: any) {
  let code: number | string = 'UNKNOWN';
  let message = 'An unexpected error occurred';

  // 1. Check if it matches the Backend Pact { status, error, code }
  if (error && typeof error === 'object' && 'code' in error && 'status' in error) {
    const backendError = error as BackendError;
    code = backendError.code;
    message = backendError.error || getErrorName(code);

    // Log with clear identification
    console.error(`🚨 [ALBA] Backend Error ${code}:`, backendError);

    // Dispatch Toast
    dispatchToast(`Error ${code}: ${message}`, 'error');
    return;
  }

  // 2. Handle standard Error objects (Network errors, etc caused by fetch failure before response)
  if (error instanceof Error) {
    message = error.message;
    console.error(`🚨 [ALBA] System Error:`, error);
    dispatchToast(message, 'error');
    return;
  }

  // 3. Fallback
  console.error(`🚨 [ALBA] Unknown Error:`, error);
  dispatchToast('An unknown error occurred', 'error');
}
