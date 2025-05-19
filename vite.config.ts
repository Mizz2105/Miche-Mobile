import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  build: {
    // Ensure that all chunks are included in the build
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // Ensure tree-shaking doesn't remove needed routes
      output: {
        manualChunks: undefined
      }
    }
  }
}));