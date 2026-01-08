/**
 * Header Navigation Behaviors
 *
 * Client-side utilities for handling header navigation, link hijacking,
 * and automatic redirection based on user session state.
 */

/**
 * Performs a URL navigation using the best available method.
 *
 * @param {string} url - Target URL
 */
export function navigateTo(url: string) {
  if (typeof window !== 'undefined' && typeof (window as any).goTo === 'function') {
    (window as any).goTo(url);
    return;
  }

  // record last navigation attempt for tests and debug purposes
  try {
    (window as any).__lastNavigation = url;
  } catch (err) {
    // ignore
  }

  try {
    window.location.assign(url);
  } catch (e) {
    // Fallback when assign is not implemented in the environment
    try {
      window.location.href = url;
    } catch (err) {
      // If real navigation is not possible (e.g., JSDOM), we still keep __lastNavigation set
    }
  }
}

/**
 * Handles clicks on the "Finalize Purchase" link.
 * Redirects to checkout if logged in, otherwise to login page.
 *
 * @param {Event} e - Click event
 * @param {string} [lang='es'] - Language code for the URL
 */
export function handleFinalizeLinkClick(e: Event, lang = 'es') {
  e.preventDefault();

  let loginFlag: string | null = null;
  try {
    if (typeof window !== 'undefined') {
      loginFlag = window.sessionStorage.getItem('login');
    }
  } catch (err) {
    // ignore storage errors
  }

  if (loginFlag === 'true') {
    navigateTo(`/${lang}/products/checkout`);
  } else {
    navigateTo(`/${lang}/account/login`);
  }
}

/**
 * Scans the document for ".finalize-purchase" links and attaches
 * the session-aware click handler.
 *
 * @param {string} [lang='es'] - Language code for target URLs
 */
export function setupFinalizeLinks(lang = 'es') {
  if (typeof document === 'undefined') return;
  const links = document.querySelectorAll('.finalize-purchase');
  links.forEach((link) => {
    link.addEventListener('click', (e) => handleFinalizeLinkClick(e, lang));
  });
}
