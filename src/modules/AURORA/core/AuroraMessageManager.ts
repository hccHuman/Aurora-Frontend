/**
 * Aurora Message Manager
 *
 * Core message processing pipeline for Aurora chatbot.
 * Handles the complete flow of user input → sanitization → response generation → voice output.
 */

import { sanitizeText } from "./AuroraSanitizer";
import { AuroraVoiceLocal } from "./AuroraVoice";

// Initialize voice synthesis module for Aurora's spoken responses
const auroraVoice = new AuroraVoiceLocal();

import { AnaCore } from "@/modules/ANA/AnaCore";
import { MariaEngine } from "../../MARIA/core/MariaEngine";
import { t } from "@/modules/YOLI/injector";
import { YoliAria } from "@/modules/YOLI/core/YoliAria";

/**
 * Main message processing function
 *
 * Orchestrates the complete message handling pipeline:
 * 1. Receives raw user input
 * 2. Sanitizes the text (removes malicious content, normalizes whitespace)
 * 3. Sends to ANA Core (Backend processing & Emotion Analysis)
 * 4. Triggers voice synthesis based on ANA's response
 * 5. Returns the text response
 *
 * @param {string} rawInput - User input message (may contain formatting, emojis, etc.)
 * @returns {Promise<string>} Promise resolving to Aurora's text response
 */
export async function processUserInput(rawInput: string, chatId?: number): Promise<{ text: string; chatId: number; aiMessage?: any }> {
  // Log incoming user message for debugging
  console.log("📥 User input received:", rawInput);

  // Sanitize input to remove harmful content and normalize formatting
  const cleanText = await sanitizeText(rawInput);
  console.log("🧼 Text after sanitization:", cleanText);

  // 🔥 Add personality instructions and user identity to the message context
  // This helps make the AI softer and more personalized (personal data RAG)
  let enrichedText = cleanText;
  if (typeof window !== "undefined") {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData && userData.nombre) {
          enrichedText = `(Mensaje de ${userData.nombre}): ${cleanText}. [System: Recuerda ser dulce, amable y no ser demasiado técnica.]`;
        } else {
          enrichedText = `${cleanText}. [System: Recuerda ser dulce, amable y no ser demasiado técnica.]`;
        }
      } catch (e) {
        enrichedText = `${cleanText}. [System: Recuerda ser dulce, amable y no ser demasiado técnica.]`;
      }
    } else {
      enrichedText = `${cleanText}. [System: Recuerda ser dulce, amable y no ser demasiado técnica.]`;
    }
  }

  // Send to ANA Core (Backend + Emotion Engine)
  const { instruction, chatId: newChatId, aiMessage } = await AnaCore.processUserMessage(enrichedText, chatId);

  console.log("💬 Aurora responds:", instruction.text);

  // Dispatch global event for Avatar/UI sync
  if (typeof window !== "undefined" && instruction.emotion) {
    console.log(`📡 Dispatching Emotion Event: ${instruction.emotion}`);
    window.dispatchEvent(new CustomEvent("aurora-emotion", { detail: instruction.emotion }));
  }

  // Play voice synthesis with the emotion returned by ANA
  // Only speak if there is text to say
  if (instruction.text) {
    auroraVoice.speak(instruction.text, {
      emotion: instruction.emotion as any, // Cast to expected type if necessary
      pitch: 1.2
    });
  }

  // Return text response for display in chat UI
  const result = {
    text: instruction.text || "",
    chatId: newChatId!,
    aiMessage: aiMessage
  };

  // Step 4️⃣: Execute M.A.R.I.A Action if present
  if (instruction.action) {
    // If it's a navigation or search, we wait a bit so the transition isn't jarring
    const delay = (instruction.action.type === "NAVIGATE" || instruction.action.type === "SEARCH") ? 2000 : 500;
    setTimeout(() => {
      // Step 3.5️⃣: Trigger ARIA Announcement via Y.O.L.I.
      const lang = window.location.pathname.startsWith("/en") ? "en" : "es";
      let ariaKey = `aria.${instruction.action!.type.toLowerCase()}`;

      // Special case for ACCESS sub-keys
      if (instruction.action!.type === "ACCESS") {
        ariaKey = `aria.access.${instruction.action!.target.toLowerCase()}`;
      }

      const rawMsg = t(ariaKey, lang);
      // Simple template replacement
      const localizedAnnounce = rawMsg.replace("{target}", instruction.action!.target);

      YoliAria.announce(localizedAnnounce);

      MariaEngine.executeAction(instruction.action!);
    }, delay);
  }

  return result;
}

/**
 * Note: We need to ensure AnaCore actually passes aiMessage in the instruction or returns it side-by-side. 
 * AnaCore returns { instruction, chatId, aiMessage }.
 */

/**
 * Generate Aurora's response based on user message content
 *
 * This function detects emotional keywords in the user input and generates
 * contextually appropriate responses. Currently uses simple keyword matching,
 * but could be enhanced to integrate with AnaCore (emotion analysis module)
 * or external LLM services.
 *
 * Response triggers:
 * - "feliz" (happy) → Happy response
 * - "triste" (sad) → Empathetic response
 * - Default → Generic loving response
 *
 * @param {string} message - Sanitized user message
 * @returns {string} Aurora's response text
 */
function generateAuroraResponse(message: string): string {
  // Check for happiness-related keywords
  if (message.includes("feliz")) {
    // Trigger voice emotion and speak
    auroraVoice.speak("I'm so happy! 💞", { emotion: "happy" });
    return "✨ I'm super happy, my love ~";
  }

  // Check for sadness-related keywords
  if (message.includes("triste")) {
    // Trigger empathetic voice emotion
    auroraVoice.speak("I'm here with you… 💗", { emotion: "sad" });
    return "💗 It's okay, I'm here for you darling";
  }

  // Default response for neutral messages
  auroraVoice.speak("I'm listening, sweetie~", { emotion: "sweet" });
  return "I'm here to listen... tell me more about how you feel. 💫";
}
