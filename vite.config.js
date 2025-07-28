import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path"; // ✅ 추가

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Chungnamthon App",
        short_name: "Chungnam",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#3f51b5",
        icons: [
          {
            src: "/icons/main-logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/main-logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ alias 설정
    },
  },
});
