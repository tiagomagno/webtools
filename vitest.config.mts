import { defineConfig } from "vitest/config";

// Testes dos utils puros (src/app/lib). Sem DOM: rodam em Node.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
