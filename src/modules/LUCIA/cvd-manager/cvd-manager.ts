/**
 * Available Color Vision Deficiency (CVD) simulation modes.
 * - 'normal': Standard vision.
 * - 'cvd-protanopia': Red-blindness.
 * - 'cvd-deuteranopia': Green-blindness.
 * - 'cvd-tritanopia': Blue-blindness.
 * - 'cvd-achromatopsia': Total color blindness (grayscale).
 */
export type CvdMode =
    | 'normal'
    | 'cvd-protanopia'
    | 'cvd-deuteranopia'
    | 'cvd-tritanopia'
    | 'cvd-achromatopsia';

const CVD_STORAGE_KEY = 'cvd-mode';

/**
 * Color Vision Deficiency (CVD) simulation manager.
 * Allows applying global CSS filters to simulate different types of color blindness.
 */
class CvdManager {
    /** Current selected CVD mode */
    private currentMode: CvdMode;

    constructor() {
        this.currentMode = this.getStoredMode();
        // Apply mode on initialization (useful for client-side navigation/SPA transitions)
        if (typeof document !== 'undefined') {
            this.applyCvdMode(this.currentMode);
        }
    }

    /**
     * Retrieves the stored CVD mode from localStorage.
     * @returns {CvdMode} The stored mode or 'normal' if none exists or invalid.
     */
    private getStoredMode(): CvdMode {
        if (typeof localStorage === 'undefined') return 'normal';

        // Safely cast string to CvdMode, default to normal if invalid
        const stored = localStorage.getItem(CVD_STORAGE_KEY) as string;
        const validModes: CvdMode[] = [
            'normal',
            'cvd-protanopia',
            'cvd-deuteranopia',
            'cvd-tritanopia',
            'cvd-achromatopsia'
        ];

        return validModes.includes(stored as CvdMode) ? (stored as CvdMode) : 'normal';
    }

    /**
     * Sets and applies a new CVD simulation mode.
     * Saves preference to localStorage and dispatches a global event.
     * 
     * @param {CvdMode} mode - The CVD mode to apply.
     */
    public setCvdMode(mode: CvdMode) {
        this.currentMode = mode;
        localStorage.setItem(CVD_STORAGE_KEY, mode);
        this.applyCvdMode(mode);

        // Dispatch event for other components if needed
        window.dispatchEvent(new CustomEvent('cvd-changed', { detail: mode }));
        console.log(`CVD Mode set to: ${mode}`);
    }

    /**
     * Gets the current CVD mode.
     * @returns {CvdMode} The active mode.
     */
    public getCvdMode(): CvdMode {
        return this.currentMode;
    }

    /**
     * Applies the CSS classes corresponding to the selected mode to the root element (html).
     * Removes any previous CVD class before adding the new one.
     * 
     * @param {CvdMode} mode - The CVD mode to render.
     */
    private applyCvdMode(mode: CvdMode) {
        if (typeof document === 'undefined') return;

        const root = document.documentElement;

        // Remove all existing CVD classes
        root.classList.remove(
            'cvd-protanopia',
            'cvd-deuteranopia',
            'cvd-tritanopia',
            'cvd-achromatopsia'
        );

        // Add new mode class if not normal
        if (mode !== 'normal') {
            root.classList.add(mode);
        }
    }
}

// Singleton export
export const cvdManager = new CvdManager();
