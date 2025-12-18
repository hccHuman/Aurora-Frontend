/**
 * Chat Service
 *
 * Handles communication with the Aurora chatbot backend.
 * Sends user messages and receives AI responses with error handling.
 */

import { handleInternalError } from "@/modules/ALBA/ErrorHandler";

/**
 * Send a user message to the Aurora chatbot and receive a response
 *
 * @param message - The user input message to send to the chatbot
 * @returns Promise resolving to an object with the chatbot's response text
 * @throws Returns fallback response if request fails
 *
 * @example
 * const response = await fetchBackendResponse("Hello Aurora!")
 * console.log(response.text) // Chatbot response
 */
export async function fetchBackendResponse(message: string) {
  try {
    // Get API URL from environment (browser or server-side)
    const apiUrl = import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

    // Construct endpoint for Aurora chat messages
    const endpoint = `${apiUrl}/aurora/chats`;

    // Send POST request with user message
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    // Check for successful response
    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    // Parse and return chatbot response
    return await res.json();
  } catch (error: any) {
    // Log error with ALBA error handler (code 800 = service timeout/unavailable)
    handleInternalError("800", error.message || error);
    // Return fallback message when chat service is unavailable
    return { text: "Sorry, I cannot connect to the server 😔" };
  }
}
