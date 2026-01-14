import React, { useState, useEffect } from "react";

/**
 * YoliAnnouncer Component
 * 
 * A hidden component that provides an aria-live region for accessibility announcements.
 * Listens for 'yoli-aria-announce' events and updates its content.
 * 
 * @component
 */
export const YoliAnnouncer: React.FC = () => {
    const [announcement, setAnnouncement] = useState("");

    useEffect(() => {
        const handleAnnounce = (e: Event) => {
            const message = (e as CustomEvent).detail;
            setAnnouncement(message);

            // Clear announcement after a short delay so the same message can be re-announced if triggered again
            const timer = setTimeout(() => setAnnouncement(""), 3000);
            return () => clearTimeout(timer);
        };

        window.addEventListener("yoli-aria-announce", handleAnnounce);
        return () => window.removeEventListener("yoli-aria-announce", handleAnnounce);
    }, []);

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: '0',
            }}
        >
            {announcement}
        </div>
    );
};
