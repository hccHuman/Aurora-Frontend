import type { AuroraVoiceOptions } from "@/models/AuroraProps/AuroraVoiceOptionsProps";

/**
 * AuroraVoiceLocal - Text-driven Lip-Sync & Speech Synthesis
 *
 * Uses the Web Speech API (SpeechSynthesis) to speak text and generates
 * estimated lip-sync data based on text content and utterance duration.
 * Provides a callback mechanism for real-time mouth animation.
 */
export class AuroraVoiceLocal {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;

  /** Callback for each "audio frame" (0..1 openness value) */
  private onAudioFrame: ((value: number) => void) | null = null;

  /** Internal ID for the lip-sync animation scheduler */
  private _lipTimerId: number | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoice();
  }

  /**
   * Set the callback for real-time audio frame updates
   *
   * @param {(value: number) => void} cb - Function to call with openness value (0..1)
   */
  public setOnAudioFrameCallback(cb: (value: number) => void) {
    this.onAudioFrame = cb;
  }

  /**
   * Load the preferred voice for Aurora
   * Prioritizes Spanish female voices.
   *
   * @private
   */
  private loadVoice() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      this.voice =
        voices.find(
          (v) =>
            v.lang.startsWith("es") &&
            /female|mujer|Helena|Conchita|Lucia|Google Español/i.test(v.name)
        ) ||
        voices.find((v) => v.lang.startsWith("es")) ||
        voices[0] ||
        null;
      console.log("🎤 Selected voice for Aurora:", this.voice?.name);
    };

    if (this.synth.getVoices().length === 0) {
      this.synth.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }

  /**
   * Speak text and generate estimated lip-sync
   *
   * Note: SpeechSynthesis does not allow capturing audio in a MediaStream.
   * Mouth activity is estimated from text (vowels/syllables) and duration.
   *
   * @param {string} text - Text to speak
   * @param {AuroraVoiceOptions} [options={}] - Speech options (rate, pitch, volume, emotion)
   */
  speak(text: string, options: AuroraVoiceOptions = {}) {
    if (!this.voice) this.loadVoice();

    // Add short warm pauses for more natural speech
    const preparedText = this._addWarmPauses(text);
    const utterance = new SpeechSynthesisUtterance(preparedText);

    if (this.voice) utterance.voice = this.voice;
    utterance.rate = options.rate ?? 0.95;
    utterance.pitch = options.pitch ?? 1.25;
    utterance.volume = options.volume ?? 1;

    // Apply light emotional variations
    switch (options.emotion) {
      case "sweet":
        utterance.pitch += 0.12;
        utterance.rate -= 0.03;
        break;
      case "sad":
        utterance.pitch -= 0.15;
        utterance.rate -= 0.08;
        utterance.volume = 0.85;
        break;
      case "happy":
        utterance.pitch += 0.18;
        utterance.rate += 0.06;
        break;
    }

    // Cancel any previous utterance and scheduler
    this.synth.cancel();
    this._stopLipTimer();

    // Estimate duration (ms) based on characters and rate
    const baseCps = 12; // Base characters per second
    const chars = preparedText.replace(/\s+/g, " ").length;
    const rateFactor = utterance.rate ?? 1;
    const estimatedSeconds = Math.max(0.8, chars / (baseCps * rateFactor));
    const estimatedMs = estimatedSeconds * 1000;

    // Divide text into approximate chunks for viseme animation
    const chunks = this._textToChunks(preparedText);

    utterance.onstart = () => {
      // Schedule lip frames to match chunks over estimatedMs
      const total = chunks.length || 1;
      const msPerChunk = estimatedMs / total;

      let idx = 0;
      const step = () => {
        // Value between 0 and 1 based on chunk content (more vowels -> more openness)
        const chunk = chunks[idx] || "";
        const v = this._chunkOpenValue(chunk);

        // Direct callback
        if (this.onAudioFrame) this.onAudioFrame(v);

        // Also dispatch window event for compatibility
        try {
          window.dispatchEvent(new CustomEvent("aurora-lipsync", { detail: v }));
        } catch (e) { }

        idx++;
        if (idx < total) {
          this._lipTimerId = window.setTimeout(step, msPerChunk);
        } else {
          // Schedule a small decay to close mouth softly
          this._lipTimerId = window.setTimeout(() => {
            if (this.onAudioFrame) this.onAudioFrame(0);
            try {
              window.dispatchEvent(new CustomEvent("aurora-lipsync", { detail: 0 }));
            } catch (e) { }
            this._lipTimerId = null;
          }, 80);
        }
      };

      // Immediate start
      step();
    };

    utterance.onend = () => {
      // Ensure mouth closure at the end
      if (this.onAudioFrame) this.onAudioFrame(0);
      try {
        window.dispatchEvent(new CustomEvent("aurora-lipsync", { detail: 0 }));
      } catch (e) { }
      this._stopLipTimer();
    };

    this.synth.speak(utterance);
  }

  /**
   * Stop the lip-sync timer
   * @private
   */
  private _stopLipTimer() {
    if (this._lipTimerId != null) {
      clearTimeout(this._lipTimerId);
      this._lipTimerId = null;
    }
  }

  /**
   * Convert text into approximate chunks for animation
   * Splits by spaces and syllable-like groups.
   *
   * @private
   * @param {string} text - Cleaned text
   * @returns {string[]} Array of text chunks
   */
  private _textToChunks(text: string): string[] {
    const clean = text
      .replace(/[…—\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const parts = clean.split(/[\s,.;!?]+/).filter(Boolean);

    const chunks: string[] = [];
    parts.forEach((p) => {
      if (p.length <= 4) chunks.push(p);
      else {
        for (let i = 0; i < p.length; i += 3) {
          chunks.push(p.slice(i, i + 3));
        }
      }
    });

    return chunks.length ? chunks : [clean || "a"];
  }

  /**
   * Simple heuristic: more vowels => more mouth openness
   *
   * @private
   * @param {string} chunk - Text fragment
   * @returns {number} Openness value from 0 to 1
   */
  private _chunkOpenValue(chunk: string): number {
    const vowels = (chunk.match(/[aeiouáéíóúüAEIOU]/g) || []).length;
    const len = Math.max(1, chunk.replace(/[^a-zA-Z0-9áéíóúüÁÉÍÓÚÜ]/g, "").length);
    const ratio = vowels / len;
    const v = Math.min(1, Math.max(0.02, ratio * 1.6));
    // Add random variance for more natural look
    return Math.min(1, Math.max(0, v + (Math.random() - 0.5) * 0.12));
  }

  /**
   * Add rhythmic pauses to text for more natural speech synthesis
   *
   * @private
   * @param {string} text - Raw response text
   * @returns {string} Text with pause markers
   */
  private _addWarmPauses(text: string): string {
    return text
      .replace(/([,;])/g, "$1 …")
      .replace(/([.!?])\s*/g, "$1 … ")
      .replace(/(\bquerida\b|\bcariño\b|\bmi amor\b)/gi, "… $1 …");
  }
}
