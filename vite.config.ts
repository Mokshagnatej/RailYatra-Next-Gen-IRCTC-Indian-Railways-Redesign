import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    tanstackStart({
      server: { entry: "server" }
    }),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
  ],
  server: {
    host: true,
    fs: {
      strict: false,
    },
  },
});
