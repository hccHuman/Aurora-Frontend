/**
 * ANA Core - Analizador de Niveles Afectivos (Emotion Analysis Module)
 *
 * Core processing unit for emotional analysis and avatar instruction generation.
 * Coordinates between backend response retrieval and emotion detection to generate
 * avatar-specific instructions (emotion, expression, motion).
 */

import { analyzeEmotion } from "./AnaEmotionMap";
import { fetchBackendResponse } from "../../services/chatService";
import type { AuroraInstruction } from "@/models/AuroraProps/AuroraInstructionProps";

/**
 * ANA Core - Emotion Analysis Service
 *
 * Provides static methods for processing user messages through the
 * emotion analysis pipeline. Converts text responses into actionable
 * avatar instructions.
 */
export class AnaCore {
  /**
   * Main emotion processing pipeline
   *
   * Complete workflow:
   * 1. Sends user message to backend and receives text response
   * 2. Analyzes emotional content to determine appropriate emotions/expressions
   * 3. Maps emotions to avatar animations (motions)
   * 4. Returns unified instruction object for avatar controller
   *
   * @param message - User input message
   * @returns Promise resolving to AuroraInstruction with emotion, expression, motion, and text
   * @throws Returns default neutral instruction if processing fails
   *
   * @example
   * const instruction = await AnaCore.processUserMessage("I feel happy!")
   * // Returns:
   * // {
   * //   emotion: 'happy',
   * //   expression: 'smile',
   * //   motion: 'haru_g_m02',
   * //   text: 'That's wonderful to hear!'
   * // }
   */
  static async processUserMessage(message: string): Promise<AuroraInstruction> {
    try {
      // Step 1️⃣: Send message to backend and retrieve AI response
      const backendResponse = await fetchBackendResponse(message);

      // Step 2️⃣: Analyze emotional content of the response text
      const emotionData = analyzeEmotion(backendResponse.text);

      // Step 3️⃣: Return complete instruction for avatar animation controller
      return {
        emotion: emotionData.emotion,
        expression: emotionData.expression,
        motion: emotionData.motion,
        text: backendResponse.text,
      };
    } catch (error) {
      // Log error for debugging
      console.error("❌ Error in AnaCore:", error);
      // Return safe default instruction to prevent app crashes
      return { emotion: "neutral", expression: "neutral", motion: "haru_g_idle" };
    }
  }
}
