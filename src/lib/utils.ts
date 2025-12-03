/**
 * Utility Functions Module
 *
 * Common utility functions used across the application.
 * Contains helper functions for CSS class merging and conditional styling.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges multiple CSS class values
 *
 * Uses clsx for conditional class handling and tailwind-merge to resolve
 * conflicting Tailwind classes. This ensures that later classes override
 * earlier ones when they have conflicting style definitions.
 *
 * @param inputs - Array of class values (strings, objects, arrays)
 * @returns Merged and normalized CSS class string
 *
 * @example
 * // Basic usage
 * cn("px-2", "py-1") // "px-2 py-1"
 *
 * // With conditional classes
 * cn("px-2", isActive && "bg-blue-500") // "px-2 bg-blue-500" or "px-2"
 *
 * // With Tailwind merging (last class wins)
 * cn("p-4", "p-2") // "p-2" (merged correctly)
 *
 * // Complex example
 * cn(
 *   "base-classes",
 *   isActive && "active-classes",
 *   { "conditional-class": isDark }
 * )
 */
export function cn(...inputs: ClassValue[]) {
  // First, clsx evaluates conditional classes and flattens the input array
  // Then, twMerge resolves conflicting Tailwind utility classes
  return twMerge(clsx(inputs));
}
