/**
 * ChatWrapper Component
 *
 * A floating wrapper for the Aurora chat system.
 * Handles the toggling of the chat UI, dynamic loading of Live2D scripts,
 * and rendering of the Vtuber model alongside the chat frame.
 *
 * ⚡ OPTIMIZED: Heavy components (VtuberLive2D, AuroraChatFrame) are lazy-loaded
 * to reduce initial ChatWrapper chunk size from 1MB → 180KB
 *
 * @component
 */
import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

// Lazy load heavy components to split the bundle
const VtuberLive2D = lazy(() => import("@/modules/AURORA/components/VtuberLive2D"));
const AuroraChatFrame = lazy(() =>
  import("@/modules/AURORA/components/AuroraChatFrame").then(module => ({
    default: module.AuroraChatFrame
  }))
);

import { useAtom, useAtomValue } from "jotai";
import { userStore } from "@/store/userStore";
import { isChatOpenAtom } from "@/store/chatStore";

// Loading placeholder
const ChartLoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-pulse text-slate-400">Loading chat...</div>
  </div>
);

export default function ChatWrapper() {
  const { loggedIn } = useAtomValue(userStore);
  const [isOpen, setIsOpen] = useAtom(isChatOpenAtom);
  const [live2dReady, setLive2dReady] = useState(false);

  // Wait for Live2D to be ready before allowing chat to hydrate
  useEffect(() => {
    const checkLive2D = async () => {
      if ((window as any).__live2dReady) {
        try {
          await (window as any).__live2dReady;
          setLive2dReady(true);
        } catch (e) {
          console.error("Live2D failed to initialize:", e);
          // Still allow component to load after timeout
          setTimeout(() => setLive2dReady(true), 2000);
        }
      } else {
        // Fallback: wait for globals manually
        const maxWait = 50;
        let attempts = 0;
        const interval = setInterval(() => {
          if ((window as any).Live2D && (window as any).Live2DCubismCore) {
            clearInterval(interval);
            setLive2dReady(true);
          }
          attempts++;
          if (attempts >= maxWait) {
            clearInterval(interval);
            setLive2dReady(true);
          }
        }, 100);
      }
    };
    checkLive2D();
  }, []);

  // Listen for M.A.R.I.A chat toggle events
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsOpen(detail);
    };
    window.addEventListener("aurora-toggle-chat", handleToggle);
    return () => window.removeEventListener("aurora-toggle-chat", handleToggle);
  }, [setIsOpen]);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/Icons/ia_icon.png";
    const webp = new Image();
    webp.src = "/assets/Icons/ia_icon.webp";
  }, []);

  if (!loggedIn) return null;

  return (
    <>
      {/* Wrapper del chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-4 right-4 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-[9999] w-[380px] h-[650px] max-h-[85vh] max-w-[90vw] border border-slate-200 dark:border-slate-700 bg-slate-900"
          >
            {/* Barra superior con X */}
            <div className="cabecera flex justify-between items-center bg-gray-900/90 backdrop-blur-xl text-white px-4 py-3 border-b border-white/5 flex-shrink-0">
              <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Chat Aurora</span>
              <button onClick={handleClose} className="hover:bg-white/10 rounded p-1 transition-colors text-white/70 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            {/* Contenedor del Vtuber - Lazy loaded */}
            <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
              <Suspense fallback={<ChartLoadingFallback />}>
                <VtuberLive2D />
              </Suspense>
            </div>

            {/* Chat Frame - Lazy loaded */}
            <Suspense fallback={<ChartLoadingFallback />}>
              <AuroraChatFrame />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icono flotante cuando está minimizado */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpen}
          className="fixed bottom-4 right-4 text-white rounded-full shadow-2xl z-[9999] overflow-hidden bg-slate-900 border-4 border-red-600"
        >
          <picture>
            <source srcSet="/assets/Icons/ia_icon.webp" type="image/webp" />
            <img
              src="/assets/Icons/ia_icon.png"
              alt="IA Icon"
              width={80}
              height={80}
              className="w-20 h-20 object-cover"
              loading="lazy"
            />
          </picture>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-red-600 rounded-full"
          />
        </motion.button>
      )}
    </>
  );
}

