import { defineConfig } from "vite";

export default defineConfig({
  // This is for GitHub Pages.
  // If you're deploying to a different server, this will need to
  // be changed or removed.
  base: "/phaser-js-rpg/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
    // We use Terser as it allows us to remove comments from the Phaser package.
    // This reduces the size of the final bundle by a few megabytes.
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 2,
      },
      mangle: true,
      format: { comments: false },
    },
  },
});
