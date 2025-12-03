import { defineConfig } from "astro/config";
import fs from "fs";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  vite: {
    server: {
      https: {
        key: fs.readFileSync("./ssl/mysite.key"),
        cert: fs.readFileSync("./ssl/mysite.crt"),
      },
      port: 4321,
    },
  },
});
