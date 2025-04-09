/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// import dns from "node:dns";

// dns.setDefaultResultOrder("verbatim");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3030,
    proxy: {
      "/api": {
        target: "http://localhost:5030",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
