import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH || "/";

  return {
    base,
    plugins: [
      viteReact(),
      tailwindcss(),
      tsConfigPaths(),
    ],
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

