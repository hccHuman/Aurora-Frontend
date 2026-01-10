// src/modules/YOLI/injector.ts
import es from "@/modules/YOLI/data/es.json";
import en from "@/modules/YOLI/data/en.json";

const translations: Record<string, any> = {
    es,
    en,
};

/**
 * Yector Omnilingüe de Lenguajes Inyectables (Y.O.L.I.)
 * Core Injector function.
 * 
 * @param key - The translation key (e.g., 'profile.title')
 * @param lang - The current language ('es' or 'en')
 * @returns The translated string or the key if not found
 */
export const t = (key: string, lang: string = "es"): string => {
    const dictionary = translations[lang] || translations["es"];

    // Navigate the nested object using dot notation
    const value = key.split('.').reduce((obj, k) => obj && obj[k], dictionary);

    return value || key;
};

/**
 * React hook for Y.O.L.I.
 * returns the translation function bound to the specified language.
 */
export const useYOLI = (lang: string) => {
    return (key: string) => t(key, lang);
};
