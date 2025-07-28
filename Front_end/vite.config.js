import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Đổi sang port bạn muốn, ví dụ 5173
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Đúng port backend của bạn
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.js"],
    reporters: ["verbose", "html"],
    outputFile: {
      html: "./test-results.html",
    },
    coverage: {
      provider: "v8", // hoặc 'c8' nếu muốn sử dụng c8
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test-setup.js",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/*.spec.{js,jsx,ts,tsx}",
        "**/index.js",
        "**/main.jsx",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
