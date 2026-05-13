#!/usr/bin/env node

/**
 * Build script for @tinybigui/tokens
 *
 * Copies all CSS files from src/ to dist/, preserving the flat structure.
 * The entry point (tokens.css) imports Tailwind and all partials via @import,
 * so every partial must be co-located in dist/ alongside it.
 *
 * Future enhancements:
 * - Generate tokens from Material Color Utilities
 * - Optimise / minify CSS output
 * - Generate TypeScript type definitions for token names
 */

import { mkdir, copyFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

async function build() {
  try {
    console.log("🏗️  Building @tinybigui/tokens...");

    const srcDir = join(rootDir, "src");
    const distDir = join(rootDir, "dist");

    // Ensure dist/ exists
    await mkdir(distDir, { recursive: true });
    console.log("✅ Created dist/ directory");

    // Copy every .css file from src/ to dist/
    const entries = await readdir(srcDir);
    const cssFiles = entries.filter((f) => extname(f) === ".css");

    for (const file of cssFiles) {
      const src = join(srcDir, file);
      const dest = join(distDir, file);
      await copyFile(src, dest);
      console.log(`✅ Copied ${file} → dist/${file}`);
    }

    console.log(`✨ Build complete! (${cssFiles.length} files)`);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();
