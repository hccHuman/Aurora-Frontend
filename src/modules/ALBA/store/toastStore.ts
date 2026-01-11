import { atom, getDefaultStore } from 'jotai';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

// Atom to hold the list of active toasts
export const toastsAtom = atom<Toast[]>([]);

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

/**
 * Action atom to add a new toast.
 * Automatically removes the toast after `duration` (default 3000ms).
 */
export const addToastAtom = atom(
    null,
    (get, set, { message, type, duration = 3000 }: Omit<Toast, 'id'>) => {
        const id = generateId();
        const newToast: Toast = { id, message, type, duration };

        set(toastsAtom, (prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                set(toastsAtom, (prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }
);


// Use the default global store to share state with React components (provider-less mode)
export const albaStore = getDefaultStore();

/**
 * Action atom to manually remove a toast by ID.
 */
export const removeToastAtom = atom(
    null,
    (get, set, id: string) => {
        set(toastsAtom, (prev) => prev.filter((t) => t.id !== id));
    }
);

/**
 * Helper to dispatch a toast from vanilla JS/TS (e.g., ErrorHandler).
 */
export const dispatchToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    albaStore.set(addToastAtom, { message, type, duration });
};
