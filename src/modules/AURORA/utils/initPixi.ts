import * as PIXI from "pixi.js";

/**
 * Ensures PIXI is available globally with the necessary settings
 * required by pixi-live2d-display.
 * 
 * This fixes the "TypeError: Cannot set properties of undefined (setting 'RETINA_PREFIX')"
 * error in production builds.
 */

// Create a mutable copy/proxy of PIXI to safely polyfill missing properties
const PIXI_GLOBAL = { ...PIXI };

// Polyfill PIXI.settings if it doesn't exist (common in some bundles)
if (!PIXI_GLOBAL.settings) {
    PIXI_GLOBAL.settings = { RETINA_PREFIX: /@2x/ } as any;
} else if (!PIXI_GLOBAL.settings.RETINA_PREFIX) {
    PIXI_GLOBAL.settings.RETINA_PREFIX = /@2x/;
}

// Expose globally for pixi-live2d-display
(window as any).PIXI = PIXI_GLOBAL;

console.log("✅ Live2D Fix: PIXI initialized globally via initPixi.ts");

export default PIXI_GLOBAL;
