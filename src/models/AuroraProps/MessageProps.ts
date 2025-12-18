/**
 * Chat Message Model
 *
 * Represents a single message in the chat conversation between
 * the user and Aurora chatbot.
 */

/**
 * Message - Chat conversation entry
 *
 * Stores individual chat messages with sender identification and content.
 * Used to maintain conversation history and render message UI.
 *
 * @interface Message
 * @property {("user" | "aurora")} sender - Who sent the message (user or Aurora AI)
 * @property {string} text - Message content/body text
 *
 * @example
 * const userMessage: Message = {
 *   sender: "user",
 *   text: "How are you feeling today?"
 * }
 *
 * const auroraResponse: Message = {
 *   sender: "aurora",
 *   text: "I'm feeling wonderful! Thank you for asking."
 * }
 */
export interface Message {
  sender: "user" | "aurora";
  text: string;
}
