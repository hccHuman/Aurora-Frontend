import React from 'react';
import { useAtom } from 'jotai';
import { cartStore } from '@/store/cartStore';
import { userStore } from '@/store/userStore';
import { paymentService } from '@/services/paymentService';
import { goTo } from '@/lib/navigation';

export const PayPalCheckout: React.FC = () => {
  const [cart, setCart] = useAtom(cartStore as any);
  const [user] = useAtom(userStore as any);

  const handlePay = async () => {
    // Session flag check fallback
    try {
      const loginFlag = typeof window !== 'undefined' ? window.sessionStorage.getItem('login') : null;

      if ((user && user.loggedIn === false) || loginFlag === 'false' || (!user || !user.loggedIn) && !loginFlag) {
        const lang = (typeof document !== 'undefined' && document.documentElement.lang) ? document.documentElement.lang : 'es';
        goTo(`/${lang}/account/login`);
        return;
      }
    } catch (e) {
      // ignore
    }

    const items = (cart.items || []).map((it: any) => ({ price: Math.round((it.price || 0) * 100), quantity: it.quantity }));

    try {
      const res = await paymentService.createPaymentIntent(items);

      if (res && res.approvalUrl) {
        // send user to PayPal approval if provided by backend
        try {
          if (typeof window !== 'undefined' && typeof window.location?.assign === 'function') {
            window.location.assign(res.approvalUrl);
          } else {
            goTo(res.approvalUrl);
          }
        } catch (e) {
          // ignore
        }
        return;
      }

      if (res && (res.success || res.clientSecret || res.id)) {
        setCart({ items: [] });
        try {
          sessionStorage.setItem('aurora_cart', JSON.stringify({ items: [] }));
        } catch (e) {
          // ignore
        }

        goTo('/');
        return;
      }

      throw new Error('Respuesta inesperada del servidor');
    } catch (err: any) {
      // If unauthorized, redirect to login
      if (err && err.status === 401) {
        const lang = (typeof document !== 'undefined' && document.documentElement.lang) ? document.documentElement.lang : 'es';
        goTo(`/${lang}/account/login`);
        return;
      }

      console.error('PayPal checkout error:', err);
    }
  };

  return (
    <div>
      <button className="ac-btn ac-btn--primary" onClick={handlePay}>Pagar con PayPal</button>
    </div>
  );
};
