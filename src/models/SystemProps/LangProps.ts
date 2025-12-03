/**
 * Language Props Model
 *
 * Props interface for language-aware components.
 * Used to pass language/locale information to components that support
 * multiple language versions (English, Spanish, etc.).
 */

/**
 * Props - Language component properties
 *
 * Props for components that render different content based on language selection.
 * Allows components to adapt their content and behavior to the current language.
 *
 * @interface Props
 * @property {string} lang - Language code (e.g., "en", "es", "fr", "de")
 *
 * @example
 * const spanishProps: Props = {
 *   lang: "es"
 * }
 *
 * const englishProps: Props = {
 *   lang: "en"
 * }
 *
 * // Usage:
 * <MultiLangComponent lang={currentLanguage} />
 */
export interface Lang {
  lang: string;
}
