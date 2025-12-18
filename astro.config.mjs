import { defineConfig } from "astro/config";
import fs from "fs";
import path from "path";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        // picocolors has different browser/module entry points and some packages import a default export.
        // Provide a compatibility shim that re-exports the namespace as default so client bundles don't fail.
        picocolors: path.resolve('./src/shims/picocolors-default.js')
      }
    },
    server: {
      https: {
        key: fs.readFileSync("./ssl/mysite.key"),
        cert: fs.readFileSync("./ssl/mysite.crt"),
      },
      port: 4321,
    },
  },
});
