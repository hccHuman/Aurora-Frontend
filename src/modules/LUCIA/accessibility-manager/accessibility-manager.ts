const EPILEPSY_KEY = 'mode-epilepsy';
const ADHD_KEY = 'mode-adhd';
const AAA_KEY = 'mode-aaa';

/**
 * Accessibility Manager for the application.
 * Controls special modes like "Epilepsy Safe", "Focus Mode (ADHD)", and "WCAG AAA".
 */
class AccessibilityManager {
    /** Indicates if epilepsy safe mode is active (reduces animations/flashing) */
    private epilepsySafe: boolean;
    /** Indicates if focus mode is active (reduces visual distractions) */
    private focusMode: boolean;
    /** Indicates if WCAG AAA strict mode is active */
    private aaaMode: boolean;

    constructor() {
        this.epilepsySafe = this.getStoredValue(EPILEPSY_KEY);
        this.focusMode = this.getStoredValue(ADHD_KEY);
        this.aaaMode = this.getStoredValue(AAA_KEY);

        if (typeof document !== 'undefined') {
            this.applyState();
        }
    }

    /**
     * Retrieves a boolean value stored in localStorage.
     * @param {string} key - The storage key.
     * @returns {boolean} True if the stored value is 'true', false otherwise.
     */
    private getStoredValue(key: string): boolean {
        if (typeof localStorage === 'undefined') return false;
        return localStorage.getItem(key) === 'true';
    }

    /**
     * Enables or disables epilepsy safe mode.
     * Saves preference and applies visual changes.
     * 
     * @param {boolean} value - New state for epilepsy mode.
     */
    public setEpilepsySafe(value: boolean) {
        this.epilepsySafe = value;
        localStorage.setItem(EPILEPSY_KEY, String(value));
        this.applyState();
        window.dispatchEvent(new CustomEvent('accessibility-changed', { detail: { type: 'epilepsy', value } }));
    }

    /**
     * Enables or disables focus mode (ADHD).
     * Saves preference and applies visual changes.
     * 
     * @param {boolean} value - New state for focus mode.
     */
    public setFocusMode(value: boolean) {
        this.focusMode = value;
        localStorage.setItem(ADHD_KEY, String(value));
        this.applyState();
        window.dispatchEvent(new CustomEvent('accessibility-changed', { detail: { type: 'adhd', value } }));
    }

    /**
     * Enables or disables WCAG AAA master mode.
     * @param {boolean} value 
     */
    public setAaaMode(value: boolean) {
        this.aaaMode = value;
        localStorage.setItem(AAA_KEY, String(value));
        this.applyState();
        window.dispatchEvent(new CustomEvent('accessibility-changed', { detail: { type: 'aaa', value } }));
    }

    /**
     * Checks if epilepsy mode is active.
     * @returns {boolean}
     */
    public isEpilepsySafe(): boolean { return this.epilepsySafe; }

    /**
     * Checks if focus mode is active.
     * @returns {boolean}
     */
    public isFocusMode(): boolean { return this.focusMode; }

    /**
     * Checks if AAA mode is active.
     * @returns {boolean}
     */
    public isAaaMode(): boolean { return this.aaaMode; }

    /**
     * Applies the CSS classes corresponding to active accessibility modes to the root element.
     */
    private applyState() {
        if (typeof document === 'undefined') return;
        const html = document.documentElement;

        if (this.epilepsySafe) html.classList.add('mode-epilepsy');
        else html.classList.remove('mode-epilepsy');

        if (this.focusMode) html.classList.add('mode-adhd');
        else html.classList.remove('mode-adhd');

        if (this.aaaMode) html.classList.add('mode-aaa');
        else html.classList.remove('mode-aaa');
    }
}

export const accessibilityManager = new AccessibilityManager();
