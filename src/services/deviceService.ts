export function getResponsivePageSize(): number {
  if (typeof window === "undefined") return 2; // fallback SSR
  const width = window.innerWidth;
  if (width >= 1024) return 8; // PC
  if (width >= 640) return 6;   // Tablet
  return 2;                      // Móvil
}