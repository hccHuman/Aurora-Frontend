/**
 * VtuberLive2D Component
 *
 * Integrates a Live2D model into a PIXI application.
 * Manages expressions, motions, and real-time lip-sync based on Aurora's state.
 * Acts as the visual representative (avatar) for the AI assistant.
 *
 * @component
 */

"use client";
import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
// Use the standalone ticker class that pixi-live2d-display expects
import { Ticker } from "@pixi/ticker";
import { Live2DModel } from "pixi-live2d-display";
import { AnaCore } from "../../ANA/AnaCore";
import { analyzeEmotion } from "../../ANA/AnaEmotionMap";
import { applyAuroraInstruction } from "../controller/AuroraController";
import { useAuroraState } from "../hook/useAuroraState";
import { AuroraChatFrame } from "./AuroraChatFrame";
import { AuroraVoiceLocal } from "../core/AuroraVoice";
import { AudioPermissionRequest } from "./AudioPermissionRequest";

// ... (existing imports)



// Main component that mounts a PIXI canvas and loads a Live2D model.
// Responsibilities:
// - Initialize the PIXI application and the Live2D model.
// - Map audio input (visemes) to the model's mouth parameters.
// - Apply expressions and motions coming from Aurora's state.
// - Provide debug helpers to play motions/expressions manually.
// Este componente se puede usar como hijo en un popup React
const VtuberLive2D: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<Live2DModel | null>(null);
  const { emotion, expression, motion, updateFromResponse } = useAuroraState();
  const voiceRef = useRef<AuroraVoiceLocal | null>(null);

  const maxWidth = 500;
  const maxHeight = 800;

  useEffect(() => {
    voiceRef.current = new AuroraVoiceLocal();
  }, []);

  const [isModelLoaded, setIsModelLoaded] = React.useState(false);

  useEffect(() => {
    let app: PIXI.Application | null = null;
    let model: Live2DModel | null = null;
    let mounted = true;

    // Responsive layout handler
    const updateLayout = () => {
      if (!model || !app || !canvasRef.current) return;

      const containerW = canvasRef.current.clientWidth;
      const containerH = canvasRef.current.clientHeight;

      if (containerW === 0 || containerH === 0) return;

      // Resize renderer to match container exactly
      app.renderer.resize(containerW, containerH);

      // "Alejar cámara un poco más": 0.72 multiplier
      // "Más abajo": Increase Y (from -180 closer to 0 or positive)
      const scaleToFitHeight = (containerH * 0.72) / 1200;
      model.scale.set(scaleToFitHeight);

      // Center horizontally
      model.x = (containerW - model.width) / 2;

      // Position vertically higher
      model.y = -110;

      console.log(`📐 Layout Re-Refined: ${containerW}x${containerH} | Scale: ${model.scale.y.toFixed(3)} | Y: ${model.y}`);
    };

    const setMouthValue = (val: number) => {
      const m = modelRef.current;
      if (!m) return;
      const clamped = Math.max(0, Math.min(1, val));
      const scaled = clamped * 0.9;

      const mouthCandidates = ["ParamMouthOpenY", "ParamMouthOpen", "ParamMouthOpenX", "MouthOpen"];

      for (const id of mouthCandidates) {
        try {
          const internal: any = m.internalModel;
          const core: any = internal.coreModel;
          if (core && typeof core.setParameterValueById === "function") {
            core.setParameterValueById(id, scaled);
            return;
          }
          const params: any = internal.parameters || (internal.coreModel && (internal.coreModel as any).parameters);
          if (params && typeof params.setValueById === "function") {
            params.setValueById(id, scaled);
            return;
          }
        } catch (e) { }
      }
      try {
        const coreAny: any = m.internalModel.coreModel;
        if (coreAny && coreAny.parameters) {
          const found = coreAny.parameters.find((p: any) => /mouth/i.test(p.id));
          if (found && typeof coreAny.setParameterValueById === "function") {
            coreAny.setParameterValueById(found.id, scaled);
          }
        }
      } catch (e) { }
    };

    const onWindowLip = (e: Event) => {
      const detail: any = (e as CustomEvent).detail;
      // console.log("👄 Client Sync:", detail); // Verify we receive it
      if (typeof detail === "number") setMouthValue(detail);
    };

    const onWindowEmotion = (e: Event) => {
      const detail: any = (e as CustomEvent).detail;
      console.log("🎭 Emotion Event Received in Live2D:", detail);
      if (detail) {
        // Map the emotion keyword (e.g. "excited") to its animation (e.g. "haru_g_m20")
        const mapped = analyzeEmotion(detail);
        updateFromResponse(mapped);
      }
    };

    window.addEventListener("aurora-lipsync", onWindowLip as EventListener);
    window.addEventListener("aurora-emotion", onWindowEmotion as EventListener);
    window.addEventListener("resize", updateLayout);

    const init = async () => {
      console.log("🟦 Iniciando aplicación PIXI...");
      const container = canvasRef.current;
      if (!container) return;

      app = new PIXI.Application({
        width: container.clientWidth,
        height: container.clientHeight,
        backgroundAlpha: 0,
        autoDensity: true,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
      });

      if (!mounted) { app.destroy(true); return; }
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
        canvasRef.current.appendChild(app.view as HTMLCanvasElement);
      }

      Live2DModel.registerTicker(Ticker);

      try {
        model = await Live2DModel.from("/models/haru/runtime/haru_greeter_t05.model3.json");
      } catch (error) { return; }

      if (!mounted || !app || !app.stage) { model?.destroy(); return; }

      model.once("load", () => {
        console.log("✅ Model fully loaded");
        if (mounted) updateLayout();
      });

      app.stage.addChild(model as any);
      modelRef.current = model;
      model.interactive = false;

      // Mark model as loaded so effects can trigger
      if (mounted) setIsModelLoaded(true);

      updateLayout();

      if (voiceRef.current) {
        voiceRef.current.setOnAudioFrameCallback((v) => setMouthValue(v));
      }

      // Background logic...
      try {
        const bgPath = "/img/frame-background.png";
        const sprite = PIXI.Sprite.from(bgPath);
        sprite.zIndex = 0;
        sprite.width = app.renderer.width;
        sprite.height = app.renderer.height;
        sprite.alpha = 0.6;
        app.stage.addChildAt(sprite, 0);
      } catch (e) { }

      app.ticker.add((delta) => {
        if (model && typeof (model as any).update === "function") {
          (model as any).update(delta * app!.ticker.deltaMS);
        }
      });
    };

    init();

    return () => {
      mounted = false;
      try {
        window.removeEventListener("aurora-lipsync", onWindowLip as EventListener);
        window.removeEventListener("aurora-emotion", onWindowEmotion as EventListener);
        window.removeEventListener("resize", updateLayout);
      } catch (e) { }
      if (model) { try { model.destroy(); } catch (e) { } }
      if (app) { try { app.destroy(true); } catch (e) { } }
    };
  }, []);

  // Expressions
  useEffect(() => {
    if (!isModelLoaded) return;
    const m = modelRef.current;
    if (!m || !expression) return;
    const expUrl = `/models/haru/runtime/expressions/${expression}.exp3.json`;

    // Guard against undefined expressionManager
    if (m.internalModel && (m.internalModel as any).expressionManager) {
      (m.internalModel as any).expressionManager
        .setExpression(expUrl)
        .catch(() => console.warn("⚠️ No se encontró la expresión:", expression));
    }
  }, [expression, isModelLoaded]);

  // Motions
  useEffect(() => {
    if (!isModelLoaded) return;
    const m = modelRef.current;
    if (!m || !motion) return;
    const motionUrl = `/models/haru/runtime/motion/${motion}.motion3.json`;
    console.log(`🎬 Triggering Motion: ${motion} | URL: ${motionUrl}`);

    // Guard against undefined motionManager
    if (m.internalModel && (m.internalModel as any).motionManager) {
      const mm = (m.internalModel as any).motionManager;
      console.log("🛠️ MotionManager detected:", mm);
      mm.stopAllMotions();
      mm.startMotion(motionUrl, 0, 3) // Priority 3 (Force)
        .then(() => console.log(`✅ Motion started successfully: ${motion}`))
        .catch((err: any) => console.error("❌ Motion failed to start:", motion, err));
    } else {
      console.warn("⚠️ No motionManager found on model's internalModel");
    }
  }, [motion, isModelLoaded]);

  const handleMessage = async (message: string) => {
    const { instruction } = await AnaCore.processUserMessage(message);
    updateFromResponse(instruction);
    applyAuroraInstruction(modelRef, instruction);

    // Also request local voice output so the avatar speaks. Uses optional
    // emotion and pitch parameters.
    if (voiceRef.current) {
      voiceRef.current.speak(instruction?.text ?? (instruction as any)?.response ?? "Te escucho, cariño~", {
        emotion: "sweet",
        pitch: 1.2,
      });
    }
  };

  // Debug panel
  const playMotion = (name: string) => {
    const m = modelRef.current;
    if (!m) return;
    const motionUrl = `/models/haru/runtime/motion/${name}.motion3.json`;
    m.internalModel.motionManager.stopAllMotions();
    m.internalModel.motionManager.startMotion(motionUrl, 0, 1);
  };

  const playExpression = (name: string) => {
    const m = modelRef.current;
    if (!m) return;
    const expUrl = `/models/haru/runtime/expressions/${name}.exp3.json`;
    const em = (m.internalModel as any).expressionManager;
    if (em && typeof em.setExpression === "function") {
      em.setExpression(expUrl);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      <div ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute bottom-0 left-0 w-full flex justify-center z-50 pointer-events-auto pb-0">
        <AuroraChatFrame />
      </div>

      <AudioPermissionRequest />
    </div>
  );
};

export default VtuberLive2D;