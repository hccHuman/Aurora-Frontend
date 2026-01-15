/**
 * ChatWrapperLazy Component
 * 
 * Lazy-loaded wrapper for ChatWrapper that's only imported when needed.
 * This allows the chatbot bundle to be code-split and loaded on-demand,
 * reducing initial bundle size significantly.
 * 
 * @component
 */
import { lazy, Suspense } from "react";

const ChatWrapperActual = lazy(() => import("./ChatWrapper"));

export default function ChatWrapperLazy() {
  return (
    <Suspense fallback={<div className="w-20 h-20 rounded-full bg-red-600 dark:bg-red-700 animate-pulse" />}>
      <ChatWrapperActual />
    </Suspense>
  );
}
