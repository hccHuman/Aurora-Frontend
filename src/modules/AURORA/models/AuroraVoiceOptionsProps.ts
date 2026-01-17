/**
 * Aurora Voice Synthesis Options Model
 *
 * Configuration options for text-to-speech voice synthesis.
 * Allows customization of how Aurora's voice sounds when responding
 * to user messages.
 */

/**
 * AuroraVoiceOptions - Voice synthesis settings
 *
 * Optional parameters for controlling voice characteristics during speech synthesis.
 * Used by the text-to-speech engine to generate voice output with specific qualities.
 *
 * All properties are optional with sensible defaults if not provided.
 *
 * @interface AuroraVoiceOptions
 * @property {number} [rate] - Speech rate (0.5 to 2.0, default: 1.0)
 *                             Values < 1.0 = slower, > 1.0 = faster
 * @property {number} [pitch] - Voice pitch (0.5 to 2.0, default: 1.0)
 *                              Values < 1.0 = deeper, > 1.0 = higher
 * @property {number} [volume] - Speech volume (0.0 to 1.0, default: 1.0)
 *                               0 = silent, 1.0 = maximum volume
 * @property {("neutral"|"sweet"|"sad"|"happy")} [emotion] - Voice tone/emotion quality
 *                                                           Affects speaking style and intonation
 *
 * @example
 * const sweetVoice: AuroraVoiceOptions = {
 *   rate: 0.9,        // Slightly slower speech
 *   pitch: 1.2,       // Higher pitched voice
 *   volume: 0.9,      // Slightly quieter
 *   emotion: "sweet"  // Sweet, gentle tone
 * }
 *
 * const fastHappy: AuroraVoiceOptions = {
 *   rate: 1.3,
 *   pitch: 1.1,
 *   emotion: "happy"
 * }
 */
export interface AuroraVoiceOptions {
  rate?: number; // velocidad de habla
  pitch?: number; // tono
  volume?: number; // volumen
  emotion?: "neutral" | "sweet" | "sad" | "happy" | "excited" | "angry" | "surprised"; // matiz emocional
}
