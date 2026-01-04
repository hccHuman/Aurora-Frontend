import type { IconConfig, Theme } from "../models/IconConfig";

class ThemeManager {
  private currentTheme: Theme;
  private icons: IconConfig[] = [];

  constructor() {
    this.currentTheme = this.getStoredTheme();
    this.applyTheme(this.currentTheme);
  }

  // Leer tema guardado o sistema
  private getStoredTheme(): Theme {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Cambiar tema
  public toggleTheme() {
    const newTheme: Theme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
    this.currentTheme = newTheme;
    localStorage.setItem("theme", newTheme);

    // Emitir evento global
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: newTheme }));

    console.log(`Theme changed to: ${newTheme}`);
  }

  // Aplicar el tema a iconos registrados
  private applyTheme(theme: Theme) {
    this.icons.forEach((icon) => {
      const el = document.getElementById(icon.id) as HTMLImageElement | null;
      if (el) {
        const basePath = icon.path ?? `/assets/Icons/${theme}`;
        el.src = `${basePath}/${icon.name}.png`;
      }
    });
    console.log(`Applied ${theme} theme to registered icons.`);
  }

  // Registrar iconos para que se actualicen automáticamente
  public registerIcons(iconConfigs: IconConfig[]) {
    this.icons.push(...iconConfigs);
    // Aplicar tema actual al registro inicial
    this.applyTheme(this.currentTheme);
  }

  // Obtener tema actual
  public getTheme(): Theme {
    return this.currentTheme;
  }
}

// Exportamos un singleton
export const themeManager = new ThemeManager();
