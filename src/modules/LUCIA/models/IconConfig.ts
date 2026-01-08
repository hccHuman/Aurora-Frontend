/**
 * Configuration for an icon that needs dynamic theme updates.
 */
export interface IconConfig {
  /** The ID of the <img> element in the DOM */
  id: string;
  /** The name of the icon file (used to build the path) */
  name: string;
  /** Optional alternative base path for the icon */
  path?: string;
}

/**
 * Available UI themes.
 */
export type Theme = "light" | "dark";
