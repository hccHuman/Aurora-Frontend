import React from 'react';
import { useAtom } from 'jotai';
import { toastsAtom, removeToastAtom } from '../store/toastStore';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'; // Adjust import based on available icons

import { useYOLI } from '@/modules/YOLI/injector';
import type { Lang } from '@/models/SystemProps/LangProps';

const ToastContainer: React.FC<Lang> = ({ lang = "es" }) => {
    const [toasts] = useAtom(toastsAtom);
    const [, removeToast] = useAtom(removeToastAtom);
    const t = useYOLI(lang);

    if (toasts.length === 0) return null;

    return (
        <div className="toast toast-end toast-top z-[9999] fixed top-4 right-4 flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto
                        flex flex-row items-center gap-3 
                        min-w-[320px] max-w-[420px]
                        p-4 rounded-xl
                        shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50
                        backdrop-blur-md
                        border border-white/20 dark:border-slate-700/50
                        transition-all duration-300 ease-out
                        animate-in slide-in-from-right-full fade-in
                        ${toast.type === 'info' ? 'bg-sky-50/90 dark:bg-slate-900/90 text-sky-900 dark:text-sky-100' :
                            toast.type === 'success' ? 'bg-emerald-50/90 dark:bg-slate-900/90 text-emerald-900 dark:text-emerald-100' :
                                toast.type === 'warning' ? 'bg-amber-50/90 dark:bg-slate-900/90 text-amber-900 dark:text-amber-100' :
                                    'bg-rose-50/90 dark:bg-slate-900/90 text-rose-900 dark:text-rose-100'
                        }
                    `}
                >
                    {/* Icon based on type */}
                    <span className={`shrink-0 ${toast.type === 'info' ? 'text-sky-500 dark:text-sky-400' :
                        toast.type === 'success' ? 'text-emerald-500 dark:text-emerald-400' :
                            toast.type === 'warning' ? 'text-amber-500 dark:text-amber-400' :
                                'text-rose-500 dark:text-rose-400'
                        }`}>
                        {toast.type === 'info' && <InformationCircleIcon className="w-6 h-6" />}
                        {toast.type === 'success' && <CheckCircleIcon className="w-6 h-6" />}
                        {toast.type === 'warning' && <ExclamationTriangleIcon className="w-6 h-6" />}
                        {toast.type === 'error' && <ExclamationCircleIcon className="w-6 h-6" />}
                    </span>

                    <div className="flex-1 flex flex-col justify-center">
                        <span className="text-sm font-semibold leading-tight">{toast.message}</span>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="btn btn-ghost btn-xs btn-circle bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border-none text-current opacity-70 hover:opacity-100 transition-opacity"
                        aria-label={t("aria.close")}
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
