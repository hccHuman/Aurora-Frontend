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

// Force Global PIXI onto window
if (typeof window !== "undefined") {
    const wins = window as any;

    // Ensure window.PIXI exists
    if (!wins.PIXI) {
        wins.PIXI = PIXI_GLOBAL;
    }

    // Polyfill PIXI.settings if it doesn't exist
    if (!wins.PIXI.settings) {
        wins.PIXI.settings = {};
    }

    // Polyfill RETINA_PREFIX
    if (!wins.PIXI.settings.RETINA_PREFIX) {
        wins.PIXI.settings.RETINA_PREFIX = /@2x/;
    }

    console.log("✅ Live2D Fix: PIXI global shimmed successfully", {
        hasSettings: !!wins.PIXI.settings,
        hasRetina: !!wins.PIXI.settings?.RETINA_PREFIX
    });
}

export default PIXI_GLOBAL;
