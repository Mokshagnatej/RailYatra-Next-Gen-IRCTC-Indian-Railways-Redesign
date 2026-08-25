import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH || "/";

  return {
    base,
    plugins: [
      viteReact(),
      tailwindcss(),
      tsConfigPaths(),
      VitePWA({ 
        registerType: 'autoUpdate',
        manifest: {
          name: 'RailYatra',
          short_name: 'RailYatra',
          description: 'Indian Railways Redesign',
          theme_color: '#0F2A45',
          background_color: '#F6F3EC',
          display: 'standalone',
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 15000000,
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'unsplash-images',
                expiration: { maxEntries: 50, maxAgeSeconds: 2592000 }
              }
            }
          ]
        }
      })
    ],
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 10000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("trainSearchIndex.json") || id.includes("trainRoutesData.json")) {
              return "train-schedules-data";
            }
            if (id.includes("stationsData.json")) {
              return "stations-database";
            }
            if (id.includes("node_modules/three") || id.includes("node_modules/@react-three")) {
              return "three-vendor";
            }
            if (id.includes("node_modules/framer-motion") || id.includes("node_modules/lucide-react")) {
              return "ui-vendor";
            }
            if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/zustand")) {
              return "react-vendor";
            }
          }
        }
      }
    },
    server: {
      host: true,
      fs: {
        strict: false,
      },
    },
  };
});

