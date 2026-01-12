import React, { useState } from "react";
import LegalModal from "./LegalModal";

/**
 * LegalModalsWrapper Component
 *
 * Wrapper component to manage legal modals in the footer.
 * Handles state and rendering of Terms, Privacy, and Cookies modals.
 *
 * @component
 */

interface LegalModalsWrapperProps {
    termsTitle: string;
    termsContent: string;
    privacyTitle: string;
    privacyContent: string;
    cookiesTitle: string;
    cookiesContent: string;
    lang?: string;
}

export default function LegalModalsWrapper({
    termsTitle,
    termsContent,
    privacyTitle,
    privacyContent,
    cookiesTitle,
    cookiesContent,
    lang = "es",
}: LegalModalsWrapperProps) {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    // Listen for custom events from footer buttons
    React.useEffect(() => {
        const handleOpenModal = (e: CustomEvent) => {
            setActiveModal(e.detail.type);
        };

        window.addEventListener('openLegalModal' as any, handleOpenModal);
        return () => window.removeEventListener('openLegalModal' as any, handleOpenModal);
    }, []);

    return (
        <>
            <LegalModal
                isOpen={activeModal === 'terms'}
                onClose={() => setActiveModal(null)}
                title={termsTitle}
                lang={lang}
            >
                <div dangerouslySetInnerHTML={{ __html: termsContent }} />
            </LegalModal>

            <LegalModal
                isOpen={activeModal === 'privacy'}
                onClose={() => setActiveModal(null)}
                title={privacyTitle}
                lang={lang}
            >
                <div dangerouslySetInnerHTML={{ __html: privacyContent }} />
            </LegalModal>

            <LegalModal
                isOpen={activeModal === 'cookies'}
                onClose={() => setActiveModal(null)}
                title={cookiesTitle}
                lang={lang}
            >
                <div dangerouslySetInnerHTML={{ __html: cookiesContent }} />
            </LegalModal>
        </>
    );
}
