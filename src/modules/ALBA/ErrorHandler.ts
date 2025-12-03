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

import type { ErrorCategories } from "@/modules/ALBA/models/ErrorCategories";
import { ERROR_CODES } from "@/modules/ALBA/data/ErrorCodes";

/**
 * Map error code to human-readable error name
 *
 * Searches error code registry across all error categories and returns
 * a categorized error name. Provides fallback for unknown error codes.
 *
 * @param code - Numeric or string error code
 * @returns Formatted error name in "CATEGORY.ERROR_NAME" format or "UNKNOWN_ERROR_CODE_XXX"
 *
 * @example
 * getErrorName(800) → "CHAT.SERVICE_TIMEOUT"
 * getErrorName(801) → "API.CATEGORY_NOT_FOUND"
 * getErrorName(999) → "UNKNOWN_ERROR_CODE_999"
 */
export function getErrorName(code: number | string): string {
  // Iterate through all error categories (CHAT, API, INTERNAL, etc.)
  for (const [category, errors] of Object.entries(ERROR_CODES) as [
    ErrorCategories,
    Record<string, string>,
  ][]) {
    // Check if error code exists in this category
    if (errors[code]) {
      // Return formatted error name like "CHAT.SERVICE_TIMEOUT"
      return `${category}.${errors[code]}`;
    }
  }
  // No match found - return generic unknown error identifier
  return `UNKNOWN_ERROR_CODE_${code}`;
}

/**
 * Log error to console with categorized error name and optional details
 *
 * Converts error code to human-readable name and outputs to console.error.
 * Includes optional context-specific details (error stack, parameter values, etc.).
 *
 * Current behavior: Console-only logging
 * Future enhancements: Remote logging integration, error dispatch to UI, analytics
 *
 * @param code - Numeric error code or string identifier
 * @param extra - Optional additional context (error object, request params, etc.)
 *
 * @example
 * handleInternalError(800)
 * // Output: 🚨 [ERROR 800] CHAT.SERVICE_TIMEOUT
 *
 * handleInternalError(801, { categoryId: 5, reason: 'Not found' })
 * // Output: 🚨 [ERROR 801] API.CATEGORY_NOT_FOUND
 * //         Detalles: { categoryId: 5, reason: 'Not found' }
 */
export function handleInternalError(code: number | string, extra?: any) {
  // Convert code to readable error name with category prefix
  const errorName = getErrorName(code);

  // Log error with visual indicator and formatted message
  console.error(`🚨 [ERROR ${code}] ${errorName}`);

  // If context details provided, log them for debugging
  if (extra) console.error("Detalles:", extra);
}
