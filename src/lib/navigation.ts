export function goTo(url: string) {
  // Single place to perform navigation; abstracted for easier testing
  // Default implementation uses window.location.assign
  if (typeof window !== 'undefined' && window.location && typeof window.location.assign === 'function') {
    window.location.assign(url);
  } else if (typeof window !== 'undefined') {
    // Fallback: mutate href (tests can stub/mock goTo instead of relying on JS DOM behavior)
    (window as any).location = (window as any).location || {};
    (window as any).location.href = url;
  }
}
