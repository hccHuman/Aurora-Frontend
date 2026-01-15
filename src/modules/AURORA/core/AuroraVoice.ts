import type { AuroraVoiceOptions } from "@/modules/AURORA/models/AuroraVoiceOptionsProps";

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
  public currentLang: string = "es"; // Default language, now public for read access

  /** Callback for each "audio frame" (0..1 openness value) */
  private onAudioFrame: ((value: number) => void) | null = null;

  /** Internal ID for the lip-sync animation scheduler */
  private _lipTimerId: number | null = null;

  constructor(lang?: string) {
    this.synth = window.speechSynthesis;
    if (lang) this.currentLang = lang;
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
   * Set language and reload voice
   *
   * @param {string} lang - Language code (es, en, etc.)
   */
  public setLanguage(lang: string) {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      this.loadVoice();
    }
  }

  /**
   * Load the preferred voice for Aurora based on language
   *
   * @private
   */
  private loadVoice() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      
      if (this.currentLang === "es") {
        // Prioritize Spanish female voices
        this.voice =
          voices.find(
            (v) =>
              v.lang.startsWith("es") &&
              /Paulina|Helena|Laura|Sabina|Zira|Microsoft|Google/i.test(v.name) &&
              !/Mobile/i.test(v.name)
          ) ||
          voices.find((v) => v.lang.startsWith("es")) ||
          voices[0] ||
          null;
      } else if (this.currentLang === "en") {
        // Prioritize English female voices
        this.voice =
          voices.find(
            (v) =>
              (v.lang.startsWith("en") || v.lang === "en") &&
              /Samantha|Victoria|Moira|Zira|Google|Microsoft/i.test(v.name) &&
              !/Male|male/i.test(v.name) &&
              !/Mobile/i.test(v.name)
          ) ||
          voices.find((v) => v.lang.startsWith("en")) ||
          voices[0] ||
          null;
      } else {
        // Fallback: just pick first voice with matching language or first available
        this.voice =
          voices.find((v) => v.lang.startsWith(this.currentLang)) ||
          voices[0] ||
          null;
      }
      
      console.log(`🎤 Selected voice for Aurora [${this.currentLang}]:`, this.voice?.name);
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

    // Strip emojis so they are not narrated by the speech engine
    const cleanText = this._stripEmojis(text);

    // Add short warm pauses for more natural speech
    const preparedText = this._addWarmPauses(cleanText);
    const utterance = new SpeechSynthesisUtterance(preparedText);

    if (this.voice) utterance.voice = this.voice;
    utterance.rate = options.rate ?? 1.0; // Default slightly faster for modern feel
    utterance.pitch = options.pitch ?? 1.1; // Default slightly higher for feminine tone
    utterance.volume = options.volume ?? 1;

    // Apply light emotional variations
    switch (options.emotion) {
      case "sweet":
        utterance.pitch += 0.1;
        utterance.rate -= 0.05;
        break;
      case "sad":
        utterance.pitch -= 0.15;
        utterance.rate -= 0.15;
        utterance.volume = 0.9;
        break;
      case "happy":
        utterance.pitch += 0.15;
        utterance.rate += 0.1;
        break;
      case "excited":
        utterance.pitch += 0.2;
        utterance.rate += 0.15;
        break;
      case "angry":
        utterance.pitch -= 0.05;
        utterance.rate += 0.1;
        utterance.volume = 1.0;
        break;
      case "surprised":
        utterance.pitch += 0.25;
        utterance.rate -= 0.05;
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

    console.log(`🗣️ Speaking: "${text.substring(0, 30)}..." | ${estimatedMs.toFixed(0)}ms | Voice: ${this.voice?.name || "Default"}`);

    // Divide text into approximate chunks for viseme animation
    const chunks = this._textToChunks(preparedText);

    utterance.onstart = () => {
      console.log("🔊 TTS Started");
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
          // console.log("👄 Dispatching lip sync:", v.toFixed(2)); // Uncomment for noisy debug
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
      console.log("🔇 TTS Ended");
      // Ensure mouth closure at the end
      if (this.onAudioFrame) this.onAudioFrame(0);
      try {
        window.dispatchEvent(new CustomEvent("aurora-lipsync", { detail: 0 }));
      } catch (e) { }
      this._stopLipTimer();
    };

    utterance.onerror = (e) => {
      console.error("❌ TTS Error:", e);
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

  /**
   * Pause ongoing speech
   * Keeps the speech synthesis paused, allowing resume()
   *
   * @public
   */
  public pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      console.log("⏸️ Speech paused");
    }
  }

  /**
   * Resume paused speech
   * Continues the speech synthesis from where it was paused
   *
   * @public
   */
  public resume() {
    if (this.synth.paused) {
      this.synth.resume();
      console.log("▶️ Speech resumed");
    }
  }

  /**
   * Check if speech is currently active
   *
   * @public
   * @returns {boolean} True if speaking or paused
   */
  public isSpeaking(): boolean {
    return this.synth.speaking;
  }

  /**
   * Save current speech state to sessionStorage for recovery after page reload
   * This allows continuing speech animation after navigation
   *
   * @public
   */
  public saveState(): void {
    if (this.synth.speaking) {
      try {
        sessionStorage.setItem(
          "aurora_voice_state",
          JSON.stringify({
            isPaused: this.synth.paused,
            timestamp: Date.now(),
            lang: this.currentLang,
          })
        );
        console.log("💾 Voice state saved to sessionStorage");
      } catch (e) {
        console.warn("⚠️ Could not save voice state:", e);
      }
    }
  }

  /**
   * Restore speech state from sessionStorage and resume if applicable
   * Called when component remounts after page reload
   *
   * @public
   */
  public restoreState(): boolean {
    try {
      const saved = sessionStorage.getItem("aurora_voice_state");
      if (saved) {
        const state = JSON.parse(saved);
        const elapsed = Date.now() - state.timestamp;
        
        // If less than 30 seconds have passed, try to resume
        if (elapsed < 30000 && state.isPaused) {
          console.log("🔄 Attempting to restore voice state...");
          
          // Update language if different
          if (state.lang !== this.currentLang) {
            this.setLanguage(state.lang);
          }
          
          // Clear the saved state
          sessionStorage.removeItem("aurora_voice_state");
          return true;
        } else {
          sessionStorage.removeItem("aurora_voice_state");
        }
      }
    } catch (e) {
      console.warn("⚠️ Could not restore voice state:", e);
    }
    return false;
  }

  /**
   * Remove emojis from text using Unicode-aware regex
   * to prevent them from being narrated by TTS engine.
   *
   * @private
   * @param {string} text - Text to clean
   * @returns {string} Cleaned text
   */
  private _stripEmojis(text: string): string {
    if (!text) return "";
    // Regex matches common emojis and extended pictographics
    // Using simple range for compatibility if needed, or \p{Extended_Pictographic}
    return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDDFF])/g, '').trim();
  }
}
