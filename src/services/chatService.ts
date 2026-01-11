/**
 * Chat Service
 *
 * Handles communication with the Aurora chatbot backend.
 * Sends user messages and receives AI responses with error handling.
 */

import { AlbaClient } from "@/modules/ALBA/AlbaClient";
import { PUBLIC_API_URL } from "@/utils/envWrapper";

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
    // TEST TRIGGER: Re-enabled for verifying UI Fix
    if (message === "testerror") {
      const mockError = { status: 400, code: 642, error: "Simulated Backend Error via Magic Word" };
      const { handleInternalError } = await import("@/modules/ALBA/ErrorHandler");
      handleInternalError(mockError);
      throw new Error(mockError.error);
    }

    // Get API URL from environment (browser or server-side)
    const apiUrl = PUBLIC_API_URL;
    // Construct endpoint for Aurora chat messages
    const endpoint = `${apiUrl}/aurora/chats`;

    // Send POST request with user message using ALBA Client
    // AlbaClient handles error interception and dispatching (Toasts)
    const res = await AlbaClient.post(endpoint, { message });

    // Parse and return chatbot response
    return await res.json();
  } catch (error: any) {
    // Error has already been logged and displayed by ALBA Client.
    // We simply return the fallback message to keep the chat interface functional.
    return { text: "Sorry, I cannot connect to the server 😔" };
  }
}
