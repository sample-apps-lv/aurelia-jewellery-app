import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  server: {
    host: true,
    port: 8009,
    hmr: {
      overlay: false,
    },
    allowedHosts: true
  },
  preview: {
    port: 8009,
    host: true,
  },
});
