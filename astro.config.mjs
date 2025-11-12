import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import solid from "@astrojs/solid-js";

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
  adapter: node({
    mode: "standalone"
  }),
  // any other global config you want (e.g. trailingSlash)
  trailingSlash: "never"
});
