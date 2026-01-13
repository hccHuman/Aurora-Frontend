/**
 * AuroraChatFrame Component
 *
 * Renders the main chat interface for interacting with Aurora.
 * Manages the message history state and coordinates with the message manager.
 * Features smooth entry animations for messages using framer-motion.
 *
 * @component
 */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { processUserInput } from "../core/AuroraMessageManager";
import { initChat } from "@/services/chatService";
import type { Message } from "../../../models/AuroraProps/MessageProps";

export const AuroraChatFrame: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<number | undefined>(undefined);
  const [input, setInput] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await initChat();
        if (response.chatId) setChatId(response.chatId);
        if (response.data) {
          setMessages(response.data);
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const tempUserMsg: Message = { remitente: "usuario", contenido: input };
    setMessages((prev) => [...prev, tempUserMsg]);
    const currentInput = input;
    setInput("");

    try {
      const { text, chatId: newChatId, aiMessage } = await processUserInput(currentInput, chatId);

      if (newChatId) setChatId(newChatId);

      // Use the full message object from backend if available, otherwise fallback to local construction
      const auroraMsg: Message = aiMessage ? aiMessage : { remitente: "ia", contenido: text };
      setMessages((prev) => [...prev, auroraMsg]);
    } catch (error) {
      console.error("Error processing user input:", error);
    }
  };

  return (
    <div className="w-full max-w-[500px] bg-gray-900/70 backdrop-blur-md rounded-2xl p-4 mt-4 text-white shadow-xl border border-pink-400/20 mx-auto">
      <div className="h-[250px] overflow-y-auto mb-3 space-y-2 scrollbar-thin scrollbar-thumb-pink-500/50">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-2 rounded-xl max-w-[80%] ${msg.remitente === "usuario"
              ? "ml-auto bg-pink-600/70 text-right"
              : "mr-auto bg-white/10 border border-pink-400/30"
              }`}
          >
            {msg.contenido}
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe un mensaje para Aurora..."
          className="flex-1 bg-gray-800 rounded-xl px-3 py-2 outline-none border border-pink-400/20 text-sm placeholder-gray-400"
        />
        <button
          onClick={handleSend}
          className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-xl font-semibold transition"
        >
          💌
        </button>
      </div>
    </div>
  );
};
