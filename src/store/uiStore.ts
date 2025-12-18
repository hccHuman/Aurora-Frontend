/**
 * UI State Store
 *
 * Jotai atom for managing user interface state across the application.
 * Tracks theme preference and navigation menu visibility.
 *
 * Used to coordinate theme switching and responsive mobile menu behavior
 * across different components and pages.
 */

import { atom } from "jotai";

/**
 * UI State Atom
 *
 * Global reactive state for UI-related settings and visibility flags.
 * Updated when:
 * - User toggles dark/light mode (darkMode flag)
 * - Mobile menu is opened/closed (mobileMenuOpen flag)
 * - Theme preference is changed
 *
 * @type {Atom<{darkMode: boolean, mobileMenuOpen: boolean}>}
 *
 * @property {boolean} darkMode - Dark mode toggle state
 * @property {boolean} mobileMenuOpen - Mobile navigation menu visibility
 *
 * @example
 * // In a component:
 * import { useAtom } from 'jotai';
 * const [ui, setUI] = useAtom(uiStore);
 *
 * // Check dark mode
 * if (ui.darkMode) {
 *   document.documentElement.classList.add('dark');
 * }
 *
 * // Toggle mobile menu
 * setUI({ ...ui, mobileMenuOpen: !ui.mobileMenuOpen });
 *
 * // Toggle dark mode
 * setUI({ ...ui, darkMode: !ui.darkMode });
 */
export const uiStore = atom({
  darkMode: false,
  mobileMenuOpen: false,
});
