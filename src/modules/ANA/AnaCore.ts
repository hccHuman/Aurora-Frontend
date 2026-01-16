/**
 * ANA Core - Analizador de Niveles Afectivos (Emotion Analysis Module)
 *
 * Core processing unit for emotional analysis and avatar instruction generation.
 * Coordinates between backend response retrieval and emotion detection to generate
 * avatar-specific instructions (emotion, expression, motion).
 */

import { analyzeEmotion } from "./AnaEmotionMap";
import { MariaEngine } from "../MARIA/core/MariaEngine";
import { sendMessage } from "@/services/chatService";
import type { AuroraInstruction } from "@/modules/AURORA/models/AuroraInstructionProps";

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
   * @param {string} message - User input message
   * @returns {Promise<AuroraInstruction>} Promise resolving to AuroraInstruction with emotion, expression, motion, and text
   * @throws {Error} Returns default neutral instruction if processing fails
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
  static async processUserMessage(message: string, chatId?: number): Promise<{ instruction: AuroraInstruction; chatId?: number; aiMessage?: any }> {
    try {
      // Step 1️⃣: Send message to backend and retrieve AI response
      const responseData = await sendMessage(message, chatId);
      console.log("📥 Backend RAW Response (COPIAME ESTO):", JSON.stringify(responseData, null, 2));

      // Extract data safely, supporting multiple potential structures
      const data = (responseData as any).data || responseData;
      const newChatId = data.chatId || (responseData as any).chatId;

      // Extraction Priority:
      // 1. data.aiMessage.contenido (Standard)
      // 2. data.aiMessage.text
      // 3. raw text if aiMessage is just a string
      // 4. (FALLBACK) Only use top-level 'message' if it's reasonably long (likely a response, not a status)

      let aiMsg = data.aiMessage || responseData.aiMessage;
      let content = "";

      if (aiMsg) {
        content = aiMsg.contenido || (aiMsg as any).text || (typeof aiMsg === 'string' ? aiMsg : "");
      } else if ((responseData as any).message && (responseData as any).message.length > 25) {
        // If it's a long message and no aiMessage exists, it might be the response
        content = (responseData as any).message;
        aiMsg = { contenido: content, remitente: "ia" };
      }

      // Normalize the message object for the UI
      const normalizedAiMsg = {
        ...(typeof aiMsg === 'object' ? aiMsg : {}),
        remitente: "ia",
        contenido: content || "..."
      };

      if (!content) {
        console.warn("⚠️ No AI content identified in response. Possible status-only response:", responseData);
      }

      // Step 2️⃣: Analyze emotional content of the response text
      // Priority: Backend Emotion > Local Analysis
      let emotionData = analyzeEmotion(content || "Neutral");

      // If backend provides a specific emotion, override the local analysis
      if (data.emotion) {
        console.log(`🎭 Backend Emotion Detected: ${data.emotion}`);

        // Use the analyzeEmotion function to find the best motion for this emotion keyword
        // This ensures we pick up the 'motionMap' we defined in AnaEmotionMap
        const mapped = analyzeEmotion(data.emotion);

        emotionData.emotion = data.emotion;
        emotionData.motion = mapped.motion; // Use the mapped motion (e.g. haru_g_m20)
        emotionData.expression = null; // No expressions available
      }

      // Step 2.5️⃣: Extract M.A.R.I.A navigation/interaction actions
      const extractionResult = MariaEngine.extractAction(content);
      const cleanText = extractionResult.cleanText;
      let action = extractionResult.action;

      // New: Check for explicit link in data (prioritized for redirection)
      if (data.link) {
        console.log(`🔗 Link detected in response data: ${data.link}`);
        action = {
          type: "NAVIGATE",
          target: data.link
        } as any; // Cast to avoid strict typing issues if AuroraAction isn't fully imported, though it fits the shape
      }

      const finalContent = cleanText || content;

      // Step 3️⃣: Return complete instruction for avatar animation controller
      return {
        instruction: {
          emotion: emotionData.emotion,
          expression: null as any, // Force null to disable expression system
          motion: emotionData.motion,
          text: finalContent,
          action: action
        },
        chatId: newChatId,
        aiMessage: { ...normalizedAiMsg, contenido: finalContent }
      };
    } catch (error) {
      // Log error for debugging
      console.error("❌ Error in AnaCore:", error);
      // Return safe default instruction to prevent app crashes
      return {
        instruction: { emotion: "neutral", expression: "neutral", motion: "haru_g_idle" },
        chatId
      };
    }
  }
}
