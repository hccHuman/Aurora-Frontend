import { defineConfig } from "astro/config";
import fs from "fs";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  vite: {
    ssr: {
      // Mark external modules that shouldn't be bundled for SSR
      noExternal: ['framer-motion'],
    },
    server: {
      https: {
        key: fs.readFileSync("./ssl/mysite.key"),
        cert: fs.readFileSync("./ssl/mysite.crt"),
      },
      port: 4321,
    },
    resolve: {
      alias: {
        // Alias pixi.js to our local patched copy to fix "RETINA_PREFIX" hydration error
        // and avoid circular dependency
        "pixi.js": "/src/vendor/pixi.mjs",
      },
    },
    // Disable source maps in production to avoid loading src files
    sourcemap: false,
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // ========== VENDOR LIBS ==========
            // ApexCharts: Only loaded in Dashboard pages
            if (id.includes("node_modules/apexcharts")) {
              return "vendor-apexcharts";
            }

            // DOMPurify: Used in sanitization
            if (id.includes("node_modules/dompurify")) {
              return "vendor-dompurify";
            }

            // i18next & related
            if (id.includes("node_modules/i18next")) {
              return "vendor-i18n";
            }

            // Live2D libraries - pixi and pixi-live2d-display bundle normally
            if (id.includes("node_modules/pixi") || id.includes("pixi-live2d")) {
              return "vendor-live2d";
            }

            // ========== AURORA MODULES ==========
            // Heavy chat components in separate lazy chunk
            if (id.includes("src/modules/AURORA/components/VtuberLive2D")) {
              return "chatbot-vtuber";
            }
            if (id.includes("src/modules/AURORA/components/AuroraChatFrame")) {
              return "chatbot-frame";
            }

            // ========== DASHBOARD-SPECIFIC ==========
            // Keep chart client libraries in dashboard chunk
            if (id.includes("src/components/tsx/Dashboard/charts")) {
              return "dashboard-charts";
            }
          },
        },
      },

      // Aggressive minification
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === "production",
          drop_debugger: true,
          passes: 2, // Multiple compression passes
        },
        mangle: true,
        format: {
          comments: false,
        },
      },

      // Chunk warning limit
      chunkSizeWarningLimit: 380,
    },
  },
});
