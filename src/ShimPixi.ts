import * as PIXI from "pixi.js";

// Shallow clone to allow property assignment
const PIXI_SHIM = { ...PIXI };

// Ensure settings object exists
if (!PIXI_SHIM.settings) {
    (PIXI_SHIM as any).settings = {};
}

// Shim RETINA_PREFIX
if (!(PIXI_SHIM.settings as any).RETINA_PREFIX) {
    (PIXI_SHIM.settings as any).RETINA_PREFIX = /@2x/;
}

// Ensure global accessibility for libraries that look for window.PIXI
if (typeof window !== "undefined") {
    (window as any).PIXI = PIXI_SHIM;
}

export * from "pixi.js"; // Re-export everything from original
export default PIXI_SHIM; // Export patched object as default

// Overwrite specific exports if they were missing/broken in the spread?
// Usually explicit exports override check.
// But for * import, it uses the module namespace object.
// We might need to manually export properties if the star export doesn't cover the PATCHED values.
// Actually, re-export * exports the ORIGINAL read-only values.
// If the library does `import { settings } from 'pixi.js'`, it gets the original (undefined).
// So we MUST implement a named export for `settings`.

export const settings = (PIXI_SHIM as any).settings;
