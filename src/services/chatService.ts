/**
 * Chat Service
 *
 * Handles communication with the Aurora chatbot backend.
 * implments endpoints for history, sending messages, and message management.
 */

import { AlbaClient } from "@/modules/ALBA/AlbaClient";
import { PUBLIC_API_URL } from "@/utils/envWrapper";
import type { Message } from "@/models/AuroraProps/MessageProps";

const BASE_URL = `${PUBLIC_API_URL}/messages`;

/**
 * Recovers the most recent chat and history on load.
 * ref: GET /messages/history
 */
export async function initChat(): Promise<{ message: string; chatId?: number; data: Message[] }> {
  try {
    const res = await AlbaClient.get(`${BASE_URL}/history`);
    return await res.json();
  } catch (error) {
    console.error("Error initializing chat:", error);
    throw error;
  }
}

/**
 * Sends a message to the IA and gets a response.
 * ref: POST /messages/chat-and-respond
 */
export async function sendMessage(contenido: string, chatId?: number, newChat: boolean = false): Promise<{ chatId: number; aiMessage: Message }> {
  try {
    // TEST TRIGGER: Keep for testing if needed, or remove if strictly following prod.
    // Keeping it simple for now.
    const payload = {
      contenido,
      chatId,
      newChat
    };
    const res = await AlbaClient.post(`${BASE_URL}/chat-and-respond`, payload);
    return await res.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

/**
 * Gets messages for a specific chat ID.
 * ref: GET /messages/by-chat/:chatId
 */
export async function getChatMessages(chatId: number): Promise<Message[]> {
  const res = await AlbaClient.get(`${BASE_URL}/by-chat/${chatId}`);
  return await res.json();
}

/**
 * Updates a user message.
 * ref: POST /messages/:id/update
 */
export async function updateMessage(id: number, contenido: string): Promise<{ updatedMessage: Message; newAiResponse: Message }> {
  const res = await AlbaClient.post(`${BASE_URL}/${id}/update`, { contenido });
  return await res.json();
}

/**
 * Deletes a message.
 * ref: POST /messages/:id/delete
 */
export async function deleteMessage(id: number): Promise<void> {
  await AlbaClient.post(`${BASE_URL}/${id}/delete`, {});
}
