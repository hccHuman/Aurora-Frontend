import type { AuroraAction } from "@/modules/AURORA/models/AuroraInstructionProps";
import { themeManager, accessibilityManager } from "@/modules/LUCIA";

/**
 * M.A.R.I.A Engine (Movimiento e Interacción de Aurora)
 * 
 * Responsible for parsing and executing proactive actions triggered by the AI.
 * Extracts commands embedded in chat responses and maps them to application events.
 */
export class MariaEngine {
    /**
     * Extracts action metadata from raw AI response text.
     * 
     * Syntax supported: [MARIA:TYPE:TARGET]
     * Example: "Claro, aquí tienes [MARIA:NAVIGATE:/productos]"
     * 
     * @param text Raw response from AI
     * @returns { action?: AuroraAction, cleanText: string }
     */
    static extractAction(text: string): { action?: AuroraAction; cleanText: string } {
        if (!text) return { cleanText: "" };

        // Matches [MARIA:TYPE:TARGET]
        const regex = /\[MARIA:(NAVIGATE|SCROLL|HIGHLIGHT|OPEN_CHAT|CLOSE_CHAT|SEARCH|ACCESS|EXPLAIN):([^\]]+)\]/i;
        const match = text.match(regex);

        if (match) {
            const type = match[1].toUpperCase() as any;
            const target = match[2].trim();

            // Remove the command from the visible text
            const cleanText = text.replace(regex, "").trim();

            console.log(`🤖 M.A.R.I.A Action Detected: ${type} -> ${target}`);

            return {
                action: { type, target },
                cleanText,
            };
        }

        return { cleanText: text };
    }

    /**
     * Executes a given AuroraAction in the browser environment.
     * 
     * @param action The action to execute
     */
    static async executeAction(action: AuroraAction) {
        if (!action) return;

        switch (action.type) {
            case "NAVIGATE":
                console.log(`🚀 M.A.R.I.A: Navigating to ${action.target}`);
                window.location.href = action.target;
                break;

            case "SEARCH":
                console.log(`🔍 M.A.R.I.A: Performing proactive search for "${action.target}"`);

                // If we are not on the all products page, navigate first and search later (using state persistence)
                if (!window.location.pathname.includes("/products/allproducts")) {
                    console.log("📍 Not on products page. Navigating first...");
                    // We can use query params or trust atomWithStorage
                    window.location.href = `/es/products/allproducts?q=${encodeURIComponent(action.target)}`;
                    return;
                }

                // If we are already on the page, trigger search immediately via event
                window.dispatchEvent(new CustomEvent("aurora-trigger-search", { detail: action.target }));
                break;

            case "ACCESS":
                console.log(`♿ M.A.R.I.A: Accessibility change requested: ${action.target}`);
                const target = action.target.toUpperCase();

                if (target === "DARK") {
                    if (themeManager.getTheme() !== "dark") themeManager.toggleTheme();
                } else if (target === "LIGHT") {
                    if (themeManager.getTheme() !== "light") themeManager.toggleTheme();
                } else if (target === "EPILEPSY_ON") accessibilityManager.setEpilepsySafe(true);
                else if (target === "EPILEPSY_OFF") accessibilityManager.setEpilepsySafe(false);
                else if (target === "ADHD_ON") accessibilityManager.setFocusMode(true);
                else if (target === "ADHD_OFF") accessibilityManager.setFocusMode(false);
                else if (target === "AAA_ON") accessibilityManager.setAaaMode(true);
                else if (target === "AAA_OFF") accessibilityManager.setAaaMode(false);
                break;

            case "EXPLAIN":
                console.log(`🎓 M.A.R.I.A: Explaining term: ${action.target}`);
                // This will be handled by the UI rendering the explanation, 
                // but we also announce it for screen readers via YOLI
                window.dispatchEvent(
                    new CustomEvent("yoli-aria-announce", {
                        detail: { type: "info", message: action.target }
                    })
                );
                break;

            case "SCROLL":
                console.log(`📜 M.A.R.I.A: Scrolling to ${action.target}`);
                const element = document.querySelector(action.target);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                break;

            case "HIGHLIGHT":
                console.log(`✨ M.A.R.I.A: Highlighting ${action.target}`);
                const el = document.querySelector(action.target);
                if (el) {
                    el.classList.add("maria-highlight");
                    setTimeout(() => el.classList.remove("maria-highlight"), 3000);
                }
                break;

            case "OPEN_CHAT":
                window.dispatchEvent(new CustomEvent("aurora-toggle-chat", { detail: true }));
                break;

            case "CLOSE_CHAT":
                window.dispatchEvent(new CustomEvent("aurora-toggle-chat", { detail: false }));
                break;
        }
    }
}
