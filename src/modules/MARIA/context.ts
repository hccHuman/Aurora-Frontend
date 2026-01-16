/**
 * M.A.R.I.A Context Handler
 * 
 * Manages the data that Aurora's AI needs to understand the current page context.
 * Collects information about the URL, visible elements, and page state.
 */

import type { MariaContext } from "./props/MariaContextProps";


/**
 * Captures the current browser context to be sent to the AI.
 */
export const captureMariaContext = (): MariaContext => {
    if (typeof window === "undefined") return { url: "", path: "", title: "", language: "", timestamp: "" };

    return {
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        language: document.documentElement.lang || "es",
        timestamp: new Date().toISOString()
    };
};
