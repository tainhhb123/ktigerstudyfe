import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Spring Boot
        changeOrigin: true,
        secure: false,
        
      },
    },
  },
});
