import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createElement } from "react";
import LegalModalsWrapper from "./LegalModalsWrapper";

/**
 * FooterModalInitializer Component
 * 
 * Initializes the footer modals when mounted.
 * This component is used with client:load to ensure it runs on the client.
 */
export default function FooterModalInitializer({ lang }: { lang: string }) {
    useEffect(() => {
        console.log("📑 [FooterInit] Inicializando Footer modals...");
        console.log("📑 [FooterInit] readyState:", document.readyState);

        // Get the HTML content from hidden divs
        const termsContent = document.getElementById("legal-content-terms")?.innerHTML || "";
        const privacyContent = document.getElementById("legal-content-privacy")?.innerHTML || "";
        const cookiesContent = document.getElementById("legal-content-cookies")?.innerHTML || "";

        console.log("📑 [FooterInit] Contenidos encontrados:", {
            terms: !!termsContent,
            privacy: !!privacyContent,
            cookies: !!cookiesContent,
        });

        // Get titles from buttons
        const termsBtn = document.querySelector('[data-modal="terms"]');
        const privacyBtn = document.querySelector('[data-modal="privacy"]');
        const cookiesBtn = document.querySelector('[data-modal="cookies"]');

        console.log("📑 [FooterInit] Botones encontrados:", {
            terms: !!termsBtn,
            privacy: !!privacyBtn,
            cookies: !!cookiesBtn,
        });

        const termsTitle = termsBtn?.textContent || "Terms & Conditions";
        const privacyTitle = privacyBtn?.textContent || "Privacy Policy";
        const cookiesTitle = cookiesBtn?.textContent || "Cookie Policy";

        console.log("📑 [FooterInit] Idioma:", lang);

        // Render the React component
        const container = document.getElementById("legal-modals-root");
        console.log("📑 [FooterInit] Contenedor root:", !!container);

        if (container) {
            console.log("📑 [FooterInit] Creando React root...");
            const root = createRoot(container);

            root.render(
                createElement(LegalModalsWrapper, {
                    termsTitle,
                    termsContent,
                    privacyTitle,
                    privacyContent,
                    cookiesTitle,
                    cookiesContent,
                    lang,
                })
            );
            console.log("📑 [FooterInit] React component renderizado ✅");
        }

        // Event delegation - attach once and it works forever
        console.log("📑 [FooterInit] Configurando event delegation...");
        const footer = document.querySelector("footer");
        console.log("📑 [FooterInit] Footer element encontrado:", !!footer);

        if (footer) {
            const handleClick = (e: Event) => {
                const target = e.target as HTMLElement;
                console.log("📑 [FooterInit] Click detectado en:", target.tagName, target.className);

                const button = target.closest(".legal-btn") as HTMLElement;
                console.log("📑 [FooterInit] Botón legal encontrado:", !!button);

                if (button) {
                    const modalType = button.dataset.modal;
                    console.log("📑 [FooterInit] Tipo de modal:", modalType);

                    if (modalType) {
                        console.log("📑 [FooterInit] 🚀 Disparando evento openLegalModal:", modalType);
                        window.dispatchEvent(
                            new CustomEvent("openLegalModal", {
                                detail: { type: modalType },
                            })
                        );
                    }
                }
            };

            footer.addEventListener("click", handleClick);
            console.log("📑 [FooterInit] Event listener configurado ✅");

            // Cleanup function
            return () => {
                footer.removeEventListener("click", handleClick);
                console.log("📑 [FooterInit] Event listener removido (cleanup)");
            };
        }

        console.log("📑 [FooterInit] ✅ Footer inicializado correctamente");
    }, [lang]); // Re-run if lang changes (though it shouldn't with transition:persist)

    // This component doesn't render anything visible
    return null;
}
