import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // This ensures that Vitest can resolve paths correctly if you use absolute imports later
      // For now, it's good practice to include
      "@": "/src",
    },
  },
  // --- NEW: Vitest Configuration ---
  test: {
    globals: true, // Makes Vitest's expect, describe, it, etc., globally available without importing
    environment: "jsdom", // Simulates a browser DOM environment for React components
    setupFiles: "./src/setupTests.ts", // Path to our test setup file
    css: false, // Prevents Vitest from processing CSS imports (usually not needed for unit tests)
    // You can add `include`, `exclude` patterns if needed, but defaults are often fine
    // E.g., include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
  // --- END NEW ---
});
