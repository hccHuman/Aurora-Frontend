import { setupFinalizeLinks, handleFinalizeLinkClick, navigateTo } from '@/lib/headerNavigation';

describe('Header navigation finalize links', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    sessionStorage.clear();
  });

  it('navigates to checkout when sessionStorage login is true', () => {
    sessionStorage.setItem('login', 'true');

    // create a link element
    const a = document.createElement('a');
    a.className = 'finalize-purchase';
    document.body.appendChild(a);

    // mock window.goTo
    (window as any).goTo = jest.fn();

    setupFinalizeLinks('es');

    a.click();

    expect((window as any).goTo).toHaveBeenCalledWith('/es/products/checkout');

    delete (window as any).goTo;
  });

  it('navigates to login when sessionStorage login is false', () => {
    sessionStorage.setItem('login', 'false');

    const a = document.createElement('a');
    a.className = 'finalize-purchase';
    document.body.appendChild(a);

    (window as any).goTo = jest.fn();

    setupFinalizeLinks('en');

    a.click();

    expect((window as any).goTo).toHaveBeenCalledWith('/en/account/login');

    delete (window as any).goTo;
  });

  it('handleFinalizeLinkClick uses navigateTo fallback when no goTo defined', () => {
    // ensure no window.goTo defined so navigateTo uses fallback
    delete (window as any).goTo;

    const e = { preventDefault: jest.fn() } as any;
    handleFinalizeLinkClick(e, 'es');

    expect(e.preventDefault).toHaveBeenCalled();
    // navigateTo records attempted navigation in __lastNavigation (test-friendly)
    expect((window as any).__lastNavigation).toBe('/es/account/login');
  });
});
