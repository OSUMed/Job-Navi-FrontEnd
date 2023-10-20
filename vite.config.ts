import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000, // Adjust the chunk size warning limit as needed
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Manually specify chunks for specific dependencies
          if (id.includes("some-large-library")) {
            return "large-library";
          }
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5177,
  },
});
