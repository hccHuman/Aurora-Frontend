import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/modules/YOLI/injector";

/**
 * LegalModal Component
 *
 * A premium modal for displaying legal content (Terms, Privacy, Cookies).
 * Features glassmorphism, smooth animations, and responsive design.
 *
 * @component
 */

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    lang?: string;
    children: React.ReactNode;
}

export default function LegalModal({ isOpen, onClose, title, lang = "es", children }: LegalModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-slate-700/50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 px-8 py-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-all text-2xl font-bold p-2 rounded-full"
                                aria-label={t("common.close", lang)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(85vh-88px)] px-8 py-6">
                            <div className="prose prose-invert prose-slate max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-a:text-red-400 prose-strong:text-slate-200">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
