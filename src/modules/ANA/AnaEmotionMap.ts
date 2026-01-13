/**
 * Emotion Dictionary & Analysis Engine
 *
 * Detects emotional content in text and maps emotions to avatar states
 * (expression and animation motions). Uses keyword matching against a
 * comprehensive emotion dictionary.
 */

import emotionDictionary from "./data/emotionDictionary.json";
import type { EmotionEntry } from "@/models/AuroraProps/EmotionEntryProps";

/**
 * Analyze text for emotional keywords and return avatar state
 *
 * Searches the emotion dictionary for keywords found in the text.
 * Returns the first matching emotional state with its associated
 * avatar expression and motion.
 *
 * @param {string} text - Text to analyze for emotional keywords
 * @returns {{emotion: string, expression: string, motion: string}} Object with emotion, expression, and motion properties
 *
 * @example
 * const state = analyzeEmotion("I feel very happy and grateful")
 * // Returns: { emotion: 'happy', expression: 'smile', motion: 'haru_g_m02' }
 */
export function analyzeEmotion(text: string) {
  // Convert text to lowercase for case-insensitive keyword matching
  const lower = text.toLowerCase();

  // Iterate through emotion dictionary entries
  for (const entry of emotionDictionary as EmotionEntry[]) {
    // Check if any keywords for this emotion match the text
    if (entry.keywords.some((keyword) => lower.includes(keyword))) {
      // Found a matching emotion - normalize the motion path
      const motion = normalizeMotion(entry.motion);
      console.log(`🎯 Emotion detected: ${entry.emotion} → Motion: ${motion}`);

      // Return emotion state with expression and animation motion
      return {
        emotion: entry.emotion,
        expression: entry.expression,
        motion, // normalized base name without extensions
      };
    }
  }

  // No emotion keywords found - return neutral default state
  console.log("😐 No emotion keywords found → Using neutral default state");
  return {
    emotion: "neutral",
    expression: "neutral",
    motion: "haru_g_idle",
  };
}

/**
 * Normalize motion file paths to usable motion names
 *
 * Removes file extensions and path separators from motion references.
 * Handles multiple formats:
 * - Full paths: /models/haru/runtime/motion/haru_g_m01.motion3.json
 * - File names: haru_g_m01.motion3.json
 * - Already normalized: haru_g_m01
 *
 * @param raw - Raw motion reference (path or filename)
 * @returns Normalized motion name without extensions
 *
 * @example
 * normalizeMotion('/models/.../haru_g_m02.motion3.json') → 'haru_g_m02'
 * normalizeMotion('haru_g_idle') → 'haru_g_idle'
 * normalizeMotion(null) → 'haru_g_idle' (default)
 */
function normalizeMotion(raw: string | undefined | null): string {
  // Return default idle motion if input is empty/null
  if (!raw) return "haru_g_idle";

  try {
    // Extract filename from full path by splitting on '/' and taking last part
    const parts = raw.split("/");
    const file = parts[parts.length - 1] || raw;

    // Remove known file extensions (.motion3.json, .motion3, .json)
    return file
      .replace(/\.motion3\.json$/i, "") // e.g., haru_g_m01.motion3.json → haru_g_m01
      .replace(/\.motion3$/i, "") // e.g., haru_g_m01.motion3 → haru_g_m01
      .replace(/\.json$/i, ""); // e.g., haru_g_m01.json → haru_g_m01
  } catch (e) {
    // If parsing fails, return raw value as fallback
    return raw;
  }
}
