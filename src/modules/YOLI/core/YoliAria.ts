/**
 * Y.O.L.I. ARIA Service
 * 
 * Manages accessibility announcements for screen readers.
 * Uses custom events to trigger an aria-live region updates.
 */

export class YoliAria {
    /**
     * Triggers an announcement for screen readers.
     * 
     * @param message The localized text to announce
     */
    static announce(message: string) {
        if (typeof window === "undefined") return;

        console.log(`🗣️ Y.O.L.I. ARIA Announcement: ${message}`);
        window.dispatchEvent(new CustomEvent("yoli-aria-announce", { detail: message }));
    }
}
