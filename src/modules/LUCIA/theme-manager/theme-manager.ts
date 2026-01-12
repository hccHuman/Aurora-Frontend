import type { IconConfig, Theme } from "../models/IconConfig";

/**
 * Application Theme Manager (Light/Dark).
 * Handles theme persistence, system preference detection,
 * and visual transitions when switching themes.
 */
class ThemeManager {
  /** Current selected theme ('light' | 'dark') */
  private currentTheme: Theme;
  /** List of registered icon configurations for dynamic updates */
  private icons: IconConfig[] = [];

  constructor() {
    this.currentTheme = this.getStoredTheme();
    this.applyTheme(this.currentTheme);
  }

  /**
   * Retrieves the stored theme from localStorage or detects system preference.
   * @returns {Theme} The initial theme ('light' or 'dark').
   */
  private getStoredTheme(): Theme {
    if (typeof localStorage === 'undefined' || typeof window === 'undefined') {
      return "light"; // Default for SSR
    }

    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  /**
   * Toggles the current theme (switch between light/dark).
   * Executes an animated visual transition (View Transition API) if possible.
   * 
   * @param {MouseEvent} [event] - Optional click event to originate the circular transition from the cursor position.
   */
  public async toggleTheme(event?: MouseEvent) {
    const newTheme: Theme = this.currentTheme === "light" ? "dark" : "light";

    // Optimized animation using View Transition API
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.applyThemeDirectly(newTheme);
      return;
    }

    // Get click coordinates if available for circular expansion center
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      this.applyThemeDirectly(newTheme);
    });

    await transition.ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  }

  private applyThemeDirectly(newTheme: Theme) {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    this.applyTheme(newTheme);
    this.currentTheme = newTheme;
    localStorage.setItem("theme", newTheme);

    window.dispatchEvent(new CustomEvent("theme-changed", { detail: newTheme }));
    console.log(`Theme changed to: ${newTheme}`);
  }

  /**
   * Applies the selected theme to the document and updates icons.
   * 
   * @param {Theme} theme - The theme to apply ('light' | 'dark').
   */
  private applyTheme(theme: Theme) {
    if (typeof document === 'undefined') return;

    this.icons.forEach((icon) => {
      const el = document.getElementById(icon.id) as HTMLImageElement | null;
      if (el) {
        const basePath = icon.path ?? `/assets/Icons/${theme}`;
        el.src = `${basePath}/${icon.name}.png`;
      }
    });
    console.log(`Applied ${theme} theme to registered icons.`);
  }

  /**
   * Registers a list of icons so their source (src) automatically updates
   * when the theme changes.
   * 
   * @param {IconConfig[]} iconConfigs - List of icon configurations.
   */
  public registerIcons(iconConfigs: IconConfig[]) {
    this.icons.push(...iconConfigs);
    // Aplicar tema actual al registro inicial
    this.applyTheme(this.currentTheme);
  }

  /**
   * Gets the current theme value.
   * @returns {Theme} 'light' or 'dark'.
   */
  public getTheme(): Theme {
    return this.currentTheme;
  }
}

// Exportamos un singleton
export const themeManager = new ThemeManager();
