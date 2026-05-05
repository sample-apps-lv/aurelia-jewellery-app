import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// @lovable.dev/vite-tanstack-config already includes:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// Do NOT add these manually or the app will break with duplicate plugins.

export default defineConfig();
