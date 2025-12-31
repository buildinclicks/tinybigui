import { defineConfig } from "tsup";

export default defineConfig({
  // Entry points
  entry: ["src/index.ts", "src/styles.css"],

  // Output formats
  format: ["esm", "cjs"],

  // Generate type definitions
  dts: true,

  // Code splitting for better tree-shaking
  splitting: true,

  // Source maps for debugging
  sourcemap: true,

  // Clean output directory before build
  clean: true,

  // Minify output
  minify: false, // Keep readable for debugging, enable for production releases

  // External dependencies (not bundled)
  external: ["react", "react-dom", "react/jsx-runtime"],

  // Tree-shaking
  treeshake: true,

  // Bundle dependencies
  bundle: true,

  // Target environment
  target: "es2022",

  // Platform
  platform: "neutral", // Works in both Node.js and browser

  // Preserve JSX for better debugging
  jsx: "automatic",

  // Output extension for CJS
  outExtension({ format }: { format: "esm" | "cjs" }) {
    return {
      js: format === "cjs" ? ".cjs" : ".js",
    };
  },
});
