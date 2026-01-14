/**
 * AuroraChatFrame Component
 *
 * Renders the main chat interface for interacting with Aurora.
 * Manages the message history state and coordinates with the message manager.
 * Features smooth entry animations for messages using framer-motion.
 *
 * @component
 */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { processUserInput } from "../core/AuroraMessageManager";
import { initChat } from "@/services/chatService";
import type { Message } from "../../../models/AuroraProps/MessageProps";

export const AuroraChatFrame: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<number | undefined>(undefined);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const tempUserMsg: Message = { remitente: "usuario", contenido: input };
    setMessages((prev) => [...prev, tempUserMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const { text, chatId: newChatId, aiMessage } = await processUserInput(currentInput, chatId);

      if (newChatId) setChatId(newChatId);

      const auroraMsg: Message = aiMessage ? aiMessage : { remitente: "ia", contenido: text };
      setMessages((prev) => [...prev, auroraMsg]);
    } catch (error) {
      console.error("Error processing user input:", error);
      // Optional: Add an error message to the chat
      setMessages((prev) => [...prev, { remitente: "ia", contenido: "Hubo un error al procesar tu mensaje. Inténtalo de nuevo." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] h-[400px] flex flex-col bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4 text-white shadow-2xl border border-pink-500/30 mx-auto overflow-hidden relative">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-3 space-y-4 px-2 scrollbar-thin scrollbar-thumb-pink-500/50 scrollbar-track-transparent pr-2"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.remitente === "usuario" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-md text-sm leading-relaxed ${msg.remitente === "usuario"
                    ? "bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-br-none"
                    : "bg-gray-800/90 border border-gray-700/50 text-gray-100 rounded-bl-none"
                  }`}
              >
                <div className="prose prose-invert prose-sm max-w-none prose-p:m-0 prose-headings:m-0 prose-ul:m-0 prose-li:m-0">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.contenido}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800/80 border border-gray-700/50 px-4 py-3 rounded-2xl rounded-bl-none flex items-center space-x-1">
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative flex gap-2 bg-gray-900 rounded-xl p-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isTyping}
            placeholder={isTyping ? "Aurora está escribiendo..." : "Escribe un mensaje..."}
            className="flex-1 bg-transparent px-3 py-2 outline-none text-white text-sm placeholder-gray-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-2.5 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
