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
import { useAtom } from "jotai";
import { chatHistoryAtom, chatIdAtom, isAuroraTypingAtom } from "@/store/chatStore";
import { processUserInput } from "../core/AuroraMessageManager";
import { initChat } from "@/services/chatService";
import type { Message } from "@/modules/AURORA/models/MessageProps";

export const AuroraChatFrame: React.FC = () => {
  const [messages, setMessages] = useAtom(chatHistoryAtom);
  const [chatId, setChatId] = useAtom(chatIdAtom);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useAtom(isAuroraTypingAtom);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      // If we have messages in RAM, we don't need to fetch.
      if (messages.length > 0) return;

      try {
        // If we have a stored chatId, try to fetch its history specifically?
        // Actually initChat() calls /messages/history, which likely returns the user's last conversation
        // based on session/auth, OR we might need to pass chatId if the API supports it.
        // Looking at chatService, initChat() is GET /messages/history. 
        // Let's assume it gets the correct history for the authenticated user.

        const response = await initChat();
        if (response.chatId) setChatId(response.chatId);
        // Only update if we actually received history messages
        if (response.data && response.data.length > 0) {
          setMessages((prev) => {
            // If user managed to type something while we were loading, preserve it
            if (prev.length > 0) return [...response.data, ...prev];
            return response.data;
          });
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    loadHistory();
    // Depends on just 'setMessages' and 'setChatId' to run once on mount (or if auth changes)
    // We removed 'messages.length' from dependency to avoid loops, though it was there before.
  }, [setMessages, setChatId]);

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
    <div className="w-full max-w-[500px] h-[340px] flex flex-col bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4 text-white shadow-2xl border border-pink-500/30 mx-auto overflow-hidden relative">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-3 space-y-4 px-2 scrollbar-thin scrollbar-thumb-pink-500/50 scrollbar-track-transparent pr-2"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && !isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 011.135-.501a34.508 34.508 0 013.438-.379c1.583-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.124-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-pink-200">¡Hola! Soy Aurora</p>
              <p className="text-xs text-white/40 max-w-[200px]">
                Aquí se guardarán los mensajes enviados. ¡Empieza a chatear!
              </p>
            </motion.div>
          )}

          {messages.map((msg, i) => {
            const isUser = msg.remitente === "usuario";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 shadow-lg 
                  ${isUser
                    ? "bg-gradient-to-tr from-gray-700 to-gray-800"
                    : "bg-gradient-to-tr from-pink-500 to-purple-600 shadow-pink-500/20"}`}
                >
                  {isUser ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/80">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white animate-pulse">
                      <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM19.307 12.307a.53.53 0 01.51.385l.21.734a1.06 1.06 0 00.727.727l.734.21a.53.53 0 010 1.018l-.734.21a1.06 1.06 0 00-.727.727l-.21.734a.53.53 0 01-1.018 0l-.21-.734a1.06 1.06 0 00-.727-.727l-.734-.21a.53.53 0 010-1.018l.734-.21a1.06 1.06 0 00.727-.727l.21-.734a.53.53 0 01.51-.385z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                  {/* Sender Name */}
                  <span className="text-[10px] font-bold text-white/30 mb-1 tracking-widest uppercase px-1">
                    {isUser ? "Tú" : "Aurora"}
                  </span>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-2.5 rounded-2xl shadow-md text-sm leading-relaxed ${isUser
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
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-end gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center border border-white/10 shadow-lg shadow-pink-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white animate-pulse">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM19.307 12.307a.53.53 0 01.51.385l.21.734a1.06 1.06 0 00.727.727l.734.21a.53.53 0 010 1.018l-.734.21a1.06 1.06 0 00-.727.727l-.21.734a.53.53 0 01-1.018 0l-.21-.734a1.06 1.06 0 00-.727-.727l-.734-.21a.53.53 0 010-1.018l.734-.21a1.06 1.06 0 00.727-.727l.21-.734a.53.53 0 01.51-.385z" clipRule="evenodd" />
              </svg>
            </div>
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
