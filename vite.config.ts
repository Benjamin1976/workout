import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

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
