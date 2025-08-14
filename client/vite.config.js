import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 4800,
    open: true,
    proxy: {
      "/api/v1": {
        target: "http://localhost:5200",
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: [
      "localhost",
      "salmon-daring-partially.ngrok-free.app",
      "https://hospital-mgmt-server.vercel.app",
      "127.0.0.1",
      "0.0.0.0",
      "::1",
    ],
  },
});
