/**
 * ChatWrapper.tsx
 * Purpose: Floating chat wrapper component that toggles the display
 * of the Aurora chat UI. When open it shows the chat container and
 * the live2D vtuber component; when closed it renders a floating
 * icon to open the chat.
 */

import { useState, useEffect } from "react";
import VtuberLive2D from "@/modules/AURORA/components/VtuberLive2D";
import { FiX } from "react-icons/fi";

export default function ChatWrapper() {
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

  return (
    <>
      {/* Wrapper del chat */}
      {isOpen && (
        <div className="fixed bottom-4 right-4  shadow-xl rounded-xl overflow-hidden flex flex-col z-50 max-h-[90vh] max-w-[95vw]">
          {/* Barra superior con X */}
          <div className="cabecera flex justify-between items-center bg-red-600 text-white px-3 py-1 flex-shrink-0">
            <span>Chat Aurora</span>
            <button onClick={handleClose}>
              <FiX size={20} />
            </button>
          </div>

          {/* Contenedor del Vtuber, se adapta automáticamente */}
          <div className="flex-1 overflow-auto">
            <VtuberLive2D client:only="react" />
          </div>
        </div>
      )}

      {/* Icono flotante cuando está minimizado */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="icono fixed bottom-4 right-4 text-white p-3 rounded-full shadow-lg z-50"
        >
          <picture>
            <source srcSet="/assets/Icons/ia_icon.webp" type="image/webp" />
            <img
              src="/assets/Icons/ia_icon.png"
              alt="IA Icon"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full"
              loading="lazy"
            />
          </picture>
        </button>
      )}
    </>
  );
}
