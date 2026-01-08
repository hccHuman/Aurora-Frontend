/* eslint-disable */
/**
 * jest.setup.js
 * Purpose: Global Jest setup script executed before tests. It registers
 * common mocks (SpeechSynthesis, fetch, Web Animations API) and installs `@testing-library/jest-dom`
 * matchers so tests can use extended DOM assertions.
 */

// Importar matchers de Testing Library
require("@testing-library/jest-dom");

// ===== MATCHMEDIA MOCK =====
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ===== MUTATION OBSERVER MOCK =====
global.MutationObserver = class {
  constructor(callback) { }
  disconnect() { }
  observe(element, init) { }
  takeRecords() {
    return [];
  }
};

// ===== INTERSECTION OBSERVER MOCK =====
global.IntersectionObserver = class {
  constructor(callback) { }
  disconnect() { }
  observe(element) { }
  unobserve(element) { }
  takeRecords() {
    return [];
  }
};

// ===== WEB ANIMATIONS API MOCK =====
// Mock the Element.animate() method for testing theme transitions
if (!Element.prototype.animate) {
  Element.prototype.animate = jest.fn(function (keyframes, options) {
    return {
      play: jest.fn(),
      pause: jest.fn(),
      cancel: jest.fn(),
      finish: jest.fn(),
      reverse: jest.fn(),
      playbackRate: 1,
      currentTime: 0,
      startTime: 0,
      playState: "running",
      ready: Promise.resolve(),
      finished: Promise.resolve(),
      effect: null,
      timeline: null,
      id: "",
      onfinish: null,
      oncancel: null,
      onremove: null,
    };
  });
}

// ===== VIEW TRANSITIONS API MOCK =====
// Mock document.startViewTransition() for theme change animations
// Use a regular function (not jest.fn) to ensure it persists through test execution
const mockStartViewTransition = (callback) => {
  // Execute the callback immediately to apply theme changes
  if (typeof callback === "function") {
    callback();
  }

  // Return a ViewTransition-like object
  return {
    ready: Promise.resolve(),
    finished: Promise.resolve(),
    updateCallbackDone: Promise.resolve(),
    skipTransition: () => { },
  };
};

// Only set if not already defined
if (typeof document.startViewTransition === "undefined") {
  document.startViewTransition = mockStartViewTransition;
}

// Mock de SpeechSynthesis para tests
globalThis.speechSynthesis = {
  getVoices: () => [
    {
      name: "Google Español",
      lang: "es-ES",
    },
  ],
  onvoiceschanged: null,
  speak: () => { },
  cancel: () => { },
  pause: () => { },
  resume: () => { },
  pending: false,
  paused: false,
};

globalThis.SpeechSynthesisUtterance = class {
  constructor(text) {
    this.text = text;
    this.voice = null;
    this.rate = 1;
    this.pitch = 1;
    this.volume = 1;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
  }
};

// Mock de fetch para API calls
globalThis.fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({ text: "Default AI Response" }),
  clone: function () {
    return this;
  },
});

beforeEach(() => {
  jest.clearAllMocks();
});
