#!/usr/bin/env node

/**
 * Build script for @tinybigui/tokens
 *
 * This simple script copies CSS files from src/ to dist/.
 * In the future, this can be enhanced to:
 * - Generate tokens from Material Color Utilities
 * - Optimize CSS output
 * - Generate TypeScript definitions
 */

import { mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

async function build() {
  try {
    console.log("🏗️  Building @tinybigui/tokens...");

    // Create dist directory
    const distDir = join(rootDir, "dist");
    await mkdir(distDir, { recursive: true });
    console.log("✅ Created dist/ directory");

    // Copy tokens.css
    const srcFile = join(rootDir, "src", "tokens.css");
    const destFile = join(distDir, "tokens.css");
    await copyFile(srcFile, destFile);
    console.log("✅ Copied tokens.css to dist/");

    console.log("✨ Build complete!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();
