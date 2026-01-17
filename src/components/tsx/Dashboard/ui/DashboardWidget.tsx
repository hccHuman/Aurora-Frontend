import React from "react";
import FadeIn from "./FadeIn";
import { cn } from "@/lib/utils"; // Assuming a 'cn' utility exists, if not I'll use template literals or standard className concatenation, but let's check lib first or use standard template literal for now to be safe. checking lib dir first is better but to save turns I will use standard string concat or tailwind-merge if available.
// I saw "clsx" and "tailwind-merge" in package.json, so I can import them. 
// However, I don't know where the 'cn' helper is located exactly (usually src/lib/utils.ts). 
// I'll stick to robust string concatenation or define a small helper if needed.
// Actually, looking at previous `list_dir src`, `lib` exists. `utils` exists.
// Let's assume standard `clsx` usage for now or safe manual string interpolation.

interface DashboardWidgetProps {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    className?: string; // Allow custom classes to be merged
}

/**
 * DashboardWidget Component
 *
 * A premium UI container for dashboard elements.
 * Encapsulates the FadeIn animation and the standard "Glassmorphic" card style.
 */
export default function DashboardWidget({
    children,
    delay = 0,
    direction = "up",
    className = "",
}: DashboardWidgetProps) {
    return (
        <FadeIn delay={delay} direction={direction}>
            <div
                className={`
          relative overflow-hidden
          rounded-2xl 
          bg-white/90 dark:bg-zinc-900/90 
          backdrop-blur-sm
          shadow-lg ring-1 ring-black/5 dark:ring-white/10
          p-6 
          transition-all duration-300 ease-out
          hover:shadow-xl hover:ring-black/10 dark:hover:ring-white/20 hover:-translate-y-1
          dark:text-white
          ${className}
        `}
            >
                {/* Optional: Subtle gradient overlay for extra premium feel */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 dark:from-transparent dark:via-white/5 dark:to-white/5 pointer-events-none" />

                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </FadeIn>
    );
}
