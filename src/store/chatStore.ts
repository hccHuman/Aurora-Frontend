import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Message } from "@/modules/AURORA/models/MessageProps";
import type { AuroraVoiceLocal } from "@/modules/AURORA/core/AuroraVoice";

/**
 * Global Chat Store
 * 
 * Manages the state of the Aurora chat system across different pages.
 * Ensures persistence and accessibility from any component.
 */

// Stores the list of messages in the current session (RAM only for security)
export const chatHistoryAtom = atom<Message[]>([]);

// Stores the current chatId (persisted to resume session)
export const chatIdAtom = atomWithStorage<number | undefined>("aurora_chat_id", undefined);

// Stores the "is typing" state globally
export const isAuroraTypingAtom = atom<boolean>(false);

// Stores the open/closed state of the chat drawer (persisted)
export const isChatOpenAtom = atomWithStorage<boolean>("aurora_chat_open", false);

// Stores Aurora's current emotional state (persisted)
export const auroraEmotionAtom = atomWithStorage<string>("aurora_emotion", "neutral");

// Stores Aurora's current facial expression (persisted)
export const auroraExpressionAtom = atomWithStorage<string>("aurora_expression", "neutral");

// Stores Aurora's current motion/animation (persisted)
export const auroraMotionAtom = atomWithStorage<string>("aurora_motion", "haru_g_idle");

// Stores whether the user has interacted with the page (to unlock audio)
export const hasUserInteractedAtom = atomWithStorage<boolean>("aurora_has_interacted", false);

// Stores the global AuroraVoiceLocal instance (RAM only, persists across component remounts)
export const auroraVoiceInstanceAtom = atom<AuroraVoiceLocal | null>(null);
