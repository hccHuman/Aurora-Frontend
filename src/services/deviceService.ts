/**
 * Calculate the optimal page size for lists based on the current window width.
 * Standardizes item counts for PC, Tablet, and Mobile views.
 *
 * @returns {number} The responsive page size (8 for PC, 6 for Tablet, 2 for Mobile)
 */
export function getResponsivePageSize(): number {
  if (typeof window === "undefined") return 2; // fallback SSR
  const width = window.innerWidth;
  if (width >= 1024) return 8; // PC
  if (width >= 640) return 6;   // Tablet
  return 2;                      // Móvil
}