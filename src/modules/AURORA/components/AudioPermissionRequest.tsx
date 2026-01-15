import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { hasUserInteractedAtom } from "@/store/chatStore";

export const AudioPermissionRequest: React.FC = () => {
    const [hasInteracted, setHasInteracted] = useAtom(hasUserInteractedAtom);
    const [visible, setVisible] = useState(!hasInteracted);

    useEffect(() => {
        // If already interacted (from storage), ensure hidden
        if (hasInteracted) {
            setVisible(false);
            return;
        }

        // Function to handle first interaction
        const handleInteraction = () => {
            setHasInteracted(true);
            setVisible(false);
            // Cleanup listeners immediately after first interaction
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
        };

        // Listen for common interaction events
        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);
        window.addEventListener("touchstart", handleInteraction);

        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
        };
    }, [hasInteracted, setHasInteracted]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed top-4 left-4 z-50 flex items-center gap-3 px-4 py-2.5 
                               bg-black/40 backdrop-blur-md border border-white/10 
                               rounded-full shadow-lg pointer-events-none select-none"
                    style={{ maxWidth: "300px" }}
                >
                    <div className="relative flex items-center justify-center w-8 h-8 
                                    bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full animate-pulse">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-4 h-4"
                        >
                            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white/90">Activar Audio</span>
                        <span className="text-[10px] text-white/60">Haz clic para interactuar</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
