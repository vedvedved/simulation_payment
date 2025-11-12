import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";

import vercel from "@astrojs/vercel";

/*
  Using adapter: node({ mode: 'standalone' })
  - 'standalone' builds a fully runnable server at dist/server/entry.mjs
  - If you'd prefer middleware mode (to mount Astro inside your own server),
    change mode to 'middleware'.
*/

export default defineConfig({
  output: "server",
  // optional: change root/base if needed
  // root: "./src",
  integrations: [solid()],
  adapter: vercel({imageService: true}),
  // any other global config you want (e.g. trailingSlash)
  trailingSlash: "never"
});