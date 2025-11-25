import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resolveFromSrc = (segment: string) => path.resolve(__dirname, "src", segment);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": resolveFromSrc("components"),
      "@pages": resolveFromSrc("pages"),
      "@utils": resolveFromSrc("utils"),
      "@assets": resolveFromSrc("assets"),
      "@api": resolveFromSrc("api"),
      "@hooks": resolveFromSrc("hooks"),
      "@app-types": resolveFromSrc("types")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});

