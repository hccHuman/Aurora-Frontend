import { useState } from "react";

/**
 * useAuroraState Hook
 *
 * Manages the emotional and animation state of Aurora.
 * Provides a central state for emotion, expression, and motion,
 * along with a utility to update these from backend responses.
 *
 * @returns {{
 *   emotion: string,
 *   expression: string,
 *   motion: string,
 *   updateFromResponse: (data: any) => void
 * }} Current state and update function
 */
export const useAuroraState = () => {
  const [emotion, setEmotion] = useState<
    "neutral" | "happy" | "sad" | "angry" | "surprised" | "scared" | "thinking" | "tired"
  >("neutral");
  const [expression, setExpression] = useState<string>("neutral");
  const [motion, setMotion] = useState<string>("haru_g_idle");

  /**
   * Updates state values from a backend response or ANA analysis result.
   *
   * @param {any} data - Object containing emotion, expression, and/or motion
   */
  const updateFromResponse = (data: any) => {
    if (!data) return;
    setEmotion(data.emotion || "neutral");
    setExpression(data.expression || "neutral");
    setMotion(data.motion || "haru_g_idle");
  };

  return { emotion, expression, motion, updateFromResponse };
};
