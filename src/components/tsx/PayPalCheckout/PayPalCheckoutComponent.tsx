import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { cartStore } from '@/store/cartStore';
import { userStore } from '@/store/userStore';
import { paymentService } from '@/services/paymentService';
import { goTo } from '@/lib/navigation';

/**
 * PayPalCheckout Component
 * 
 * Handles the PayPal payment flow by creating a payment intent
 * and redirecting the user as needed.
 * 
 * @component
 */
export const PayPalCheckout: React.FC = () => {
    const [cart, setCart] = useAtom(cartStore);
    const [user] = useAtom(userStore);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayPalPayment = async () => {
        setLoading(true);
        setError(null);

        // 1. Check if user is logged in
        const isLoggedIn = sessionStorage.getItem('login') !== 'false' && user.loggedIn;
        if (!isLoggedIn) {
            goTo('/account/login');
            setLoading(false);
            return;
        }

        try {
            // 2. Prepare items for the backend (converting price to cents as expected by Stripe/PayPal wrappers)
            const items = cart.items.map(item => ({
                price: Math.round(item.price * 100),
                quantity: item.quantity
            }));

            // 3. Create payment intent
            const response = await paymentService.createPaymentIntent(items);

            if (response.success) {
                // 4. Clear cart on success
                setCart({ items: [] });
                sessionStorage.setItem('aurora_cart', JSON.stringify({ items: [] }));

                // 5. Redirect to home or approval URL if provided
                if (response.approvalUrl) {
                    window.location.href = response.approvalUrl;
                } else {
                    goTo('/');
                }
            } else {
                setError('Error al procesar el pago con PayPal.');
            }
        } catch (err: any) {
            if (err.status === 401) {
                goTo('/account/login');
            } else {
                setError(err.message || 'Ocurrió un error inesperado.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="paypal-checkout-container p-4 border rounded-xl bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Pago con PayPal</h3>
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <button
                onClick={handlePayPalPayment}
                disabled={loading || cart.items.length === 0}
                className="w-full py-3 px-6 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold rounded-full transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                aria-label="Pagar con PayPal"
            >
                {loading ? (
                    <span>Cargando...</span>
                ) : (
                    <>
                        <span className="italic font-extrabold text-xl">PayPal</span>
                        <span>Pagar ahora</span>
                    </>
                )}
            </button>
        </div>
    );
};
