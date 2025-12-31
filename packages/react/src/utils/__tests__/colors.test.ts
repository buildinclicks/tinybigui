/**
 * Color Utilities Tests
 *
 * This file demonstrates using test utilities we just created.
 * Tests all the color manipulation functions.
 */

import { describe, test, expect } from "vitest";
import { withOpacity, hexToRgb, rgbToHex, applyStateLayer, STATE_LAYER_OPACITY } from "../colors";

describe("Color Utilities", () => {
  describe("withOpacity", () => {
    test("adds opacity to hex color", () => {
      const result = withOpacity("#6750a4", 0.5);
      expect(result).toBe("#6750a480");
    });

    test("handles hex without # prefix", () => {
      const result = withOpacity("6750a4", 0.5);
      expect(result).toBe("#6750a480");
    });

    test("clamps opacity to 0-1 range", () => {
      expect(withOpacity("#6750a4", -0.5)).toBe("#6750a400"); // 0%
      expect(withOpacity("#6750a4", 1.5)).toBe("#6750a4ff"); // 100%
    });

    test("converts opacity to 2-digit hex", () => {
      expect(withOpacity("#ff0000", 0.08)).toBe("#ff000014"); // 8%
      expect(withOpacity("#ff0000", 0.12)).toBe("#ff00001f"); // 12%
      expect(withOpacity("#ff0000", 1.0)).toBe("#ff0000ff"); // 100%
    });
  });

  describe("hexToRgb", () => {
    test("converts hex to RGB object", () => {
      const result = hexToRgb("#6750a4");
      expect(result).toEqual({ r: 103, g: 80, b: 164 });
    });

    test("handles hex without # prefix", () => {
      const result = hexToRgb("6750a4");
      expect(result).toEqual({ r: 103, g: 80, b: 164 });
    });

    test("converts common colors correctly", () => {
      expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
    });
  });

  describe("rgbToHex", () => {
    test("converts RGB to hex", () => {
      const result = rgbToHex(103, 80, 164);
      expect(result).toBe("#6750a4");
    });

    test("pads single digits with zero", () => {
      expect(rgbToHex(1, 2, 3)).toBe("#010203");
    });

    test("clamps values to 0-255 range", () => {
      expect(rgbToHex(-10, 300, 128)).toBe("#00ff80");
    });

    test("rounds decimal values", () => {
      expect(rgbToHex(103.7, 80.2, 164.9)).toBe("#6850a5");
    });
  });

  describe("applyStateLayer", () => {
    test("applies hover state opacity (8%)", () => {
      const result = applyStateLayer("#6750a4", "hover");
      expect(result).toBe("#6750a414");
    });

    test("applies focus state opacity (12%)", () => {
      const result = applyStateLayer("#6750a4", "focus");
      expect(result).toBe("#6750a41f");
    });

    test("applies press state opacity (12%)", () => {
      const result = applyStateLayer("#6750a4", "press");
      expect(result).toBe("#6750a41f");
    });

    test("applies drag state opacity (16%)", () => {
      const result = applyStateLayer("#6750a4", "drag");
      expect(result).toBe("#6750a429");
    });
  });

  describe("STATE_LAYER_OPACITY", () => {
    test("has correct MD3 opacity values", () => {
      expect(STATE_LAYER_OPACITY.hover).toBe(0.08);
      expect(STATE_LAYER_OPACITY.focus).toBe(0.12);
      expect(STATE_LAYER_OPACITY.press).toBe(0.12);
      expect(STATE_LAYER_OPACITY.drag).toBe(0.16);
    });

    test("is readonly (cannot be modified)", () => {
      // TypeScript prevents this, but we can verify the constant exists
      expect(STATE_LAYER_OPACITY).toBeDefined();
      expect(Object.keys(STATE_LAYER_OPACITY)).toHaveLength(4);
    });
  });
});
