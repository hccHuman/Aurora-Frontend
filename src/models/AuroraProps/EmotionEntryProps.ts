/**
 * Emotion Dictionary Entry Model
 *
 * Dictionary entry mapping keywords to avatar emotional states and animations.
 * Used by the ANA (emotional analysis) module to detect emotions in chat responses
 * and generate appropriate avatar animations.
 */

/**
 * EmotionEntry - Keyword-to-emotion mapping
 *
 * Defines a single entry in the emotion dictionary (emotionDictionary.json).
 * Contains keywords that trigger this emotion and the corresponding avatar state.
 *
 * Used by analyzeEmotion() function to match response text against keywords
 * and return the appropriate emotional expression and motion.
 *
 * @interface EmotionEntry
 * @property {string[]} keywords - List of words that trigger this emotion (case-insensitive)
 * @property {string} emotion - Emotion label (happy, sad, angry, calm, etc.)
 * @property {string} expression - Avatar facial expression name
 * @property {string} motion - Avatar motion/animation file name (e.g., haru_g_m02)
 *
 * @example
 * const happyEntry: EmotionEntry = {
 *   keywords: ["happy", "joyful", "wonderful", "great", "excellent"],
 *   emotion: "happy",
 *   expression: "smile",
 *   motion: "haru_g_m02"
 * }
 *
 * const sadEntry: EmotionEntry = {
 *   keywords: ["sad", "unhappy", "depressed", "blue", "heartbroken"],
 *   emotion: "sad",
 *   expression: "frown",
 *   motion: "haru_g_m03"
 * }
 */
export interface EmotionEntry {
  keywords: string[];
  emotion: string;
  expression: string;
  motion: string;
}
