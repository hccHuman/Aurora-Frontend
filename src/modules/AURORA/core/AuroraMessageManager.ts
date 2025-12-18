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

/**
 * Main message processing function
 *
 * Orchestrates the complete message handling pipeline:
 * 1. Receives raw user input
 * 2. Sanitizes the text (removes malicious content, normalizes whitespace)
 * 3. Generates appropriate response based on content
 * 4. Triggers voice synthesis for Aurora to speak
 * 5. Returns the text response
 *
 * @param rawInput - User input message (may contain formatting, emojis, etc.)
 * @returns Promise resolving to Aurora's text response
 */
export async function processUserInput(rawInput: string): Promise<string> {
  // Log incoming user message for debugging
  console.log("📥 User input received:", rawInput);

  // Sanitize input to remove harmful content and normalize formatting
  const cleanText = await sanitizeText(rawInput);
  console.log("🧼 Text after sanitization:", cleanText);

  // Generate contextual response based on user input
  const response = generateAuroraResponse(cleanText);
  console.log("💬 Aurora responds:", response);

  // Play voice synthesis (Aurora speaks the response)
  auroraVoice.speak(response, { emotion: "sweet", pitch: 1.2 });

  // Return text response for display in chat UI
  return response;
}

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
 * @param message - Sanitized user message
 * @returns Aurora's response text
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
