/**
 * ChatWrapper Component
 *
 * A floating wrapper for the Aurora chat system.
 * Handles the toggling of the chat UI, dynamic loading of Live2D scripts,
 * and rendering of the Vtuber model alongside the chat frame.
 *
 * @component
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import VtuberLive2D from "@/modules/AURORA/components/VtuberLive2D";

import { useAtomValue } from "jotai";
import { userStore } from "@/store/userStore";

export default function ChatWrapper() {
  const { loggedIn } = useAtomValue(userStore);
  const [isOpen, setIsOpen] = useState(false);



  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  useEffect(() => {
    if (isOpen) {
      // Crear script 1
      const script1 = document.createElement("script");
      script1.src = "/webpack/live2d.min.js";
      script1.async = true;

      // Crear script 2
      const script2 = document.createElement("script");
      script2.src = "/webpack/live2dcubismcore.js";
      script2.async = true;

      document.body.appendChild(script1);
      document.body.appendChild(script2);

      return () => {
        document.body.removeChild(script1);
        document.body.removeChild(script2);
      };
    }
  }, [isOpen]);

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
            className="fixed bottom-4 right-4 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-50 max-h-[90vh] max-w-[95vw] border border-slate-200 dark:border-slate-700"
          >
            {/* Barra superior con X */}
            <div className="cabecera flex justify-between items-center bg-red-600 dark:bg-red-700 text-white px-4 py-2 flex-shrink-0">
              <span className="font-bold text-sm tracking-wide">Chat Aurora</span>
              <button onClick={handleClose} className="hover:bg-red-500 rounded p-1 transition-colors">
                <FiX size={20} />
              </button>
            </div>

            {/* Contenedor del Vtuber */}
            <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
              <VtuberLive2D />
            </div>
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
          className="fixed bottom-4 right-4 text-white rounded-full shadow-2xl z-50 overflow-hidden bg-slate-900 border-4 border-red-600"
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

