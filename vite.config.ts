import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isSpa = mode === "gh-pages" || process.env.BUILD_SPA === "true" || process.env.GITHUB_PAGES === "true";
  const base = process.env.VITE_BASE_PATH || (isSpa ? "/UI-UX-Design-Event/" : "/");

  return {
    base,
    plugins: [
      !isSpa && tanstackStart({
        server: { entry: "server" }
      }),
      viteReact(),
      tailwindcss(),
      tsConfigPaths(),
    ].filter(Boolean),
    build: {
      outDir: "dist",
    },
    server: {
      host: true,
      fs: {
        strict: false,
      },
    },
  };
});

