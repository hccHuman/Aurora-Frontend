import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartStore } from '@/store/cartStore';
import { userStore } from '@/store/userStore';
import { paymentService } from '@/services/paymentService';
import { goTo } from '@/lib/navigation';

/**
 * CheckoutComponent Component
 *
 * Manages the final checkout process including order review and Stripe payment initiation.
 * Handles route protection (ensuring user is logged in), responsive loading states,
 * and cart synchronization with the global cartStore.
 *
 * @component
 */
export default function CheckoutComponent() {
  const [cart, setCart] = useAtom(cartStore);
  const [user] = useAtom(userStore);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const total = cart.items.reduce(
    (acc: number, it: any) => acc + (it.price || 0) * (it.quantity || 1),
    0
  );

  /* ================================
     MOUNT + PROTECCIÓN DE RUTA
  ================================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user?.ready) return; // ⛔ esperamos a LoginReader

    if (!user.loggedIn || !user.user?.id) {
      const lang =
        typeof document !== 'undefined'
          ? document.documentElement.lang || 'es'
          : 'es';

      goTo(`/${lang}/account/login`);
    }
  }, [mounted, user]);

  /* ================================
     CHECKOUT
  ================================= */
  const onCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!user?.ready || !user.loggedIn || !user.user?.id) {
      setError('Debes iniciar sesión para finalizar la compra.');
      setLoading(false);
      return;
    }

    const items = cart.items.map((it: any) => ({
      id: it.productId,
      price: Math.round((it.price || 0) * 100),
      quantity: it.quantity,
      category_id: it.category_id,
    }));

    const payload = {
      userId: user.user.id,
      items,
    };


    try {
      const res = await (paymentService.Order as any)(payload);

      if (res?.clientSecret) {
        setSuccess('Pago iniciado correctamente.');
        setCart({ items: [] });
        goTo('/');
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (err: any) {
      setError(err.message || 'Error iniciando pago');
      console.error(err);
      if (err.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
        goTo('/account/login');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     LOADING / BLOQUEO VISUAL
  ================================= */
  if ((!mounted || !user?.ready) && !success) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-slate-500">
        Cargando checkout…
      </div>
    );
  }

  if (cart.items.length === 0 && !success) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-900 border rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Revisar pedido</h2>
        <p className="text-center text-slate-500">
          Tu carrito está vacío.
        </p>
      </div>
    );
  }

  /* ================================
     UI PRINCIPAL
  ================================= */
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Revisar pedido</h2>

      <div className="divide-y max-h-96 overflow-y-auto">
        {cart.items.map((it: any) => (
          <div key={it.productId} className="py-3 flex justify-between">
            <div>
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-slate-500">
                {it.price} € × {it.quantity}
              </div>
            </div>
            <div className="font-bold">
              {((it.price || 0) * (it.quantity || 1)).toFixed(2)} €
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Total
        </div>
        <div className="text-2xl font-extrabold text-sky-600">
          {total.toFixed(2)} €
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <div className="flex gap-3">
        <button
          onClick={onCheckout}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Procesando…' : 'Pagar'}
        </button>
        <button
          onClick={() => setCart({ items: [] })}
          className="flex-1 px-4 py-2 border rounded-lg"
        >
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}
