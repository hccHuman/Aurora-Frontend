import { useAtom } from "jotai";
import { auroraEmotionAtom, auroraExpressionAtom, auroraMotionAtom } from "@/store/chatStore";

/**
 * useAuroraState Hook
 *
 * Manages the emotional and animation state of Aurora.
 * Uses persistent global state (Jotai + localStorage) so that the avatar's
 * mood and position are remembered across page navigations.
 *
 * @returns {{
 *   emotion: string,
 *   expression: string,
 *   motion: string,
 *   updateFromResponse: (data: any) => void
 * }} Current state and update function
 */
export const useAuroraState = () => {
  const [emotion, setEmotion] = useAtom(auroraEmotionAtom);
  const [expression, setExpression] = useAtom(auroraExpressionAtom);
  const [motion, setMotion] = useAtom(auroraMotionAtom);

  /**
   * Updates state values from a backend response or ANA analysis result.
   *
   * @param {any} data - Object containing emotion, expression, and/or motion
   */
  const updateFromResponse = (data: any) => {
    if (!data) return;
    console.log("🔄 Updating Aurora State (Trigger):", data);
    if (data.emotion !== undefined) setEmotion(data.emotion);
    if (data.expression !== undefined) setExpression(data.expression);
    if (data.motion !== undefined) setMotion(data.motion);
  };

  return { emotion, expression, motion, updateFromResponse };
};
