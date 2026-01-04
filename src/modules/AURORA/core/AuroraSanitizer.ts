/**
 * Aurora Text Sanitizer
 *
 * Sanitizes user input to remove malicious content, normalize formatting,
 * and filter inappropriate language. This is a critical security component
 * that prevents XSS attacks and ensures safe text processing.
 */

/**
 * Sanitize user input text
 *
 * Performs the following operations:
 * 1. Trims leading/trailing whitespace
 * 2. Removes non-alphanumeric characters (except allowed punctuation and accented letters)
 * 3. Normalizes multiple spaces to single spaces
 * 4. Enforces maximum length (300 characters)
 * 5. Replaces prohibited/offensive words with emoji
 *
 * @param input - Raw user input text
 * @returns Promise resolving to sanitized text
 *
 * @example
 * const clean = await sanitizeText("  Hello!!! WORLD  ");
 * // Returns: "Hello! WORLD"
 */
export async function sanitizeText(input: string): Promise<string> {
  // Remove leading/trailing whitespace
  let text = input.trim();

  // Remove unwanted characters: keep only word chars, spaces, punctuation, and Spanish accents
  // Pattern allows: alphanumeric, spaces, periods, commas, exclamation, question marks, and accents
  text = text.replace(/[^\w\s.,!?¡¿áéíóúÁÉÍÓÚñÑ]/g, "");

  // Normalize multiple consecutive spaces to single space
  text = text.replace(/\s+/g, " ");

  // Enforce maximum length for security (prevents buffer overflow, spam)
  if (text.length > 300) {
    text = text.slice(0, 300) + "...";
  }

  // Remove or replace offensive/prohibited words
  const prohibited = ["tonto", "idiota", "estúpido"]; // spanish insults
  prohibited.forEach((word) => {
    // Case-insensitive replacement with word boundaries to match whole words only
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    // Replace offensive words with emoji instead of removing (keeps message readable)
    text = text.replace(regex, "💫");
  });

  return text;
}
