import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  // Nitro deploys to Cloudflare Workers in module mode; swap the preset for another host.
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({ server: { entry: "server" } }),
    // Nitro defaults compatibilityDate to "latest", i.e. the day you built, which
    // makes builds unreproducible and breaks local preview on an older workerd.
    // Without an explicit name it derives one from the package name and account.
    ...(command === "build"
      ? [
          nitro({
            preset: "cloudflare-module",
            compatibilityDate: "2026-01-01",
            cloudflare: { wrangler: { name: "fasthand-studio" } },
          }),
        ]
      : []),
    viteReact(),
  ],
  css: { transformer: "lightningcss" },
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  server: { host: "::", port: 8080 },
}));
