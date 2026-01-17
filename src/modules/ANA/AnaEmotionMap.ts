/**
 * Emotion Dictionary & Analysis Engine
 *
 * Detects emotional content in text and maps emotions to avatar states
 * (expression and animation motions). Uses keyword matching against a
 * comprehensive emotion dictionary.
 */

import emotionDictionary from "./data/emotionDictionary.json";
import type { EmotionEntry } from "@/modules/AURORA/models/EmotionEntryProps";

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
  const lower = text.toLowerCase();

  // Defines direct mapping from meaningful emotions to specific Motion files
  // verified to exist in: /models/haru/runtime/motion/
  const motionMap: Record<string, string> = {
    // Joy / Happiness
    "feliz": "haru_g_m02",       // Joyful movement
    "happy": "haru_g_m02",
    "contento": "haru_g_m02",
    "alegre": "haru_g_m02",
    "genial": "haru_g_m02",
    "excited": "haru_g_m20",     // Excited jumping/active
    "emocionado": "haru_g_m20",

    // Sadness / Empathy
    "triste": "haru_g_m14",      // Looking down / sad
    "sad": "haru_g_m14",
    "pena": "haru_g_m14",
    "lo siento": "haru_g_m14",
    "perdon": "haru_g_m14",

    // Anger / Annoyance
    "enfado": "haru_g_m19",      // Angry / Frustrated
    "angry": "haru_g_m19",
    "molesto": "haru_g_m19",

    // Surprise / Shock
    "sorpresa": "haru_g_m08",    // Surprised
    "surprised": "haru_g_m08",
    "wow": "haru_g_m08",

    // Love / Affection
    "amor": "haru_g_m22",        // Shy / Loving
    "love": "haru_g_m22",
    "te quiero": "haru_g_m22",
    "cariño": "haru_g_m22",

    // Thinking / Waiting
    "pensar": "haru_g_m26",      // Thinking pose
    "thinking": "haru_g_m26",

    // Default Greetings/Neutral
    "hola": "haru_g_m01",
    "hello": "haru_g_m01"
  };

  // Check manual map first
  for (const [key, motion] of Object.entries(motionMap)) {
    if (lower.includes(key)) {
      console.log(`🎯 Direct Emotion Motion: ${key} -> ${motion}`);
      return {
        emotion: key,
        expression: null, // No expressions available
        motion: motion
      };
    }
  }

  // Fallback to dictionary if needed, but likely the map above covers core interactions
  for (const entry of emotionDictionary as EmotionEntry[]) {
    if (entry.keywords.some((keyword) => lower.includes(keyword))) {
      const motion = normalizeMotion(entry.motion);
      return {
        emotion: entry.emotion,
        expression: null, // Force null expression
        motion,
      };
    }
  }

  // Neutral default
  return {
    emotion: "neutral",
    expression: null,
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
