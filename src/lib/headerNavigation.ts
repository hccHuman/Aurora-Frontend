// Client-side utilities for header navigation behaviors
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

export function setupFinalizeLinks(lang = 'es') {
  if (typeof document === 'undefined') return;
  const links = document.querySelectorAll('.finalize-purchase');
  links.forEach((link) => {
    link.addEventListener('click', (e) => handleFinalizeLinkClick(e, lang));
  });
}
