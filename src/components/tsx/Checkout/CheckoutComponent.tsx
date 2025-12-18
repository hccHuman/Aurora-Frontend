import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartStore } from '@/store/cartStore';
import { userStore } from '@/store/userStore';
import { paymentService } from '@/services/paymentService';
import { goTo } from '@/lib/navigation';

export default function CheckoutComponent() {
  const [cart, setCart] = useAtom(cartStore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const total = cart.items.reduce((acc: number, it: any) => acc + (it.price || 0) * (it.quantity || 1), 0);

  const [user] = useAtom(userStore);

  const onCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Prefer runtime auth from userStore, but fallback to sessionStorage for compatibility/tests
    try {
      const loginFlag = typeof window !== 'undefined' ? window.sessionStorage.getItem('login') : null;

      // If user atom explicitly indicates not logged in, redirect
      if (user && user.loggedIn === false) {
        setError('Debes iniciar sesión para finalizar la compra. Redirigiendo...');
        const lang = (typeof document !== 'undefined' && document.documentElement.lang) ? document.documentElement.lang : 'es';
        goTo(`/${lang}/account/login`);
        setLoading(false);
        return;
      }

      // If user evidence not available, rely on sessionStorage: explicit 'false' or absence -> redirect
      if ((!user || !user.loggedIn) && loginFlag === 'false') {
        setError('Debes iniciar sesión para finalizar la compra. Redirigiendo...');
        const lang = (typeof document !== 'undefined' && document.documentElement.lang) ? document.documentElement.lang : 'es';
        goTo(`/${lang}/account/login`);
        setLoading(false);
        return;
      }

      if ((!user || !user.loggedIn) && !loginFlag) {
        setError('Debes iniciar sesión para finalizar la compra. Redirigiendo...');
        const lang = (typeof document !== 'undefined' && document.documentElement.lang) ? document.documentElement.lang : 'es';
        goTo(`/${lang}/account/login`);
        setLoading(false);
        return;
      }
    } catch (e) {
      // ignore storage errors
    }

    // Prepare items payload in cents (backend expects integer prices)
    const items = cart.items.map((it: any) => ({ price: Math.round((it.price || 0) * 100), quantity: it.quantity }));

    try {
      const res = await paymentService.createPaymentIntent(items);

      // assume a successful response contains success: true or a clientSecret
      if (res && (res.success || res.clientSecret || res.id)) {
        // show success then clear cart so the success message can be seen
        setSuccess('Pago iniciado correctamente. Procede con el flujo de pago.');
        setCart({ items: [] });

        // Attempt to navigate home after a successful payment initiation
        try {
          goTo('/');
          // Then check robustly whether navigation happened, and show fallback if not
          ensureNavigationOrFallback('/');
        } catch (e) {
          console.warn('Navigation to home failed:', e);
          setRedirectFailed(true);
        }
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (err: any) {

      setError(err.message || 'Error iniciando pago');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Always render the panel so we can show success/error messages even after cart is cleared
  // Prevent SSR/CSR hydration mismatch by deferring item list rendering until client mount
  const [mounted, setMounted] = useState(false);
  const [redirectFailed, setRedirectFailed] = useState(false);
  // Use an ASCII-only default for SSR to avoid encoding/hydration mismatches,
  // then replace with the accented version on the client after mount.
  const [emptyMessage, setEmptyMessage] = useState('Tu carrito esta vacio.');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Replace empty message with accented version on client only to avoid SSR encoding mismatches
    if (mounted) setEmptyMessage('Tu carrito está vacío.');
  }, [mounted]);

  if (!mounted || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Revisar pedido</h2>
        {/* Render ASCII on server, then update to accented text on client via `emptyMessage` to avoid SSR/CSR encoding mismatches */}
        <p className="text-center mb-4">{emptyMessage}</p>
        {error && <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>}
        {success && <p className="text-green-600 dark:text-green-400 mb-2">{success}</p>}
        {redirectFailed && (
          <div className="mt-3 text-center">
            <p className="text-sm text-slate-500">No se pudo redirigir automáticamente. Puedes ir al inicio manualmente:</p>
            <a href="/" className="ac-btn ac-btn--primary mt-2 inline-block">Ir al inicio</a>
          </div>
        )}
      </div>
    );
  }

  // Helper: robustly detect whether navigation happened; if not within timeout mark redirectFailed
  const ensureNavigationOrFallback = (expectedHrefOrPath: string, timeout = 2000) => {
    const start = Date.now();
    const check = () => {
      try {
        if (typeof window !== 'undefined') {
          const href = window.location.href || '';
          const path = window.location.pathname || '';
          if (href.includes(expectedHrefOrPath) || path === expectedHrefOrPath) return true;
        }
      } catch (e) {
        // ignore
      }
      if (Date.now() - start > timeout) {
        setRedirectFailed(true);
        return false;
      }
      // retry after a short delay
      setTimeout(check, 200);
      return false;
    };
    setTimeout(check, 200);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Revisar pedido</h2>

      <ul className="divide-y divide-slate-200 dark:divide-slate-700 mb-4">
        {cart.items.map((it: any) => (
          <li key={it.productId} className="py-3 flex justify-between items-center">
            <div>
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-slate-500">Precio: {it.price} € × {it.quantity}</div>
            </div>
            <div className="font-bold">{((it.price || 0) * (it.quantity || 1)).toFixed(2)} €</div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mb-4">
        <div className="text-lg">Total</div>
        <div className="text-2xl font-extrabold text-sky-600">{total.toFixed(2)} €</div>
      </div>

      {error && <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>}
      {success && <p className="text-green-600 dark:text-green-400 mb-2">{success}</p>}

      <div className="flex gap-3">
        <button onClick={onCheckout} disabled={loading} className="ac-btn ac-btn--primary">
          {loading ? 'Procesando...' : 'Pagar (crear Payment Intent)'}
        </button>
        <button onClick={() => setCart({ items: [] })} className="ac-btn">
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}