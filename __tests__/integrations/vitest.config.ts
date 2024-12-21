import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    alias: {
      "@": resolve(__dirname, "..", "..", "src"),
    },
    include: ["__tests__/**/*.test.ts"],
    testTimeout: 100000, // Tempo em milissegundos (10 segundos)
    fileParallelism: false,
    setupFiles: resolve(__dirname, "setup.ts"),
  },
});
