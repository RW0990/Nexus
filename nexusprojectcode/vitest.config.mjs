/*Source https://vitest.dev/guide/coverage.html */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["app.test.js"],
    coverage: {
      provider: "v8",
      include: ["app.js", "models/**/*.js"],
      exclude: ["views/**", "public/**", "node_modules/**", "**/*test.js"],
      reporter: ["text", "html", "json"],
    },
  },
});
