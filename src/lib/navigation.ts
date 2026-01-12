/**
 * Navigation Utilities
 *
 * Provides abstracted navigation functions to simplify URL updates
 * and improve testability by mocking global location changes.
 */

/**
 * Redirects the browser to the specified URL.
 * Works across different environments (browser and tests).
 *
 * @param {string} url - Target URL
 */
export function goTo(url: string) {
  // Single place to perform navigation; abstracted for easier testing
  if (typeof window !== 'undefined' && window.location && typeof window.location.assign === 'function') {
    window.location.assign(url);
  } else if (typeof window !== 'undefined') {
    // Fallback: mutate href (tests can stub/mock goTo instead of relying on JS DOM behavior)
    (window as any).location = (window as any).location || {};
    (window as any).location.href = url;
  }
}
