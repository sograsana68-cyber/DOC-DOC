import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Listen on all interfaces so the app is reachable in remote/preview environments
    host: true,
    port: 5173,
    strictPort: false,
  },
});
