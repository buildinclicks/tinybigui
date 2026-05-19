import { describe, test, expectTypeOf } from "vitest";
import type {
  SliderVariant,
  SliderSize,
  SliderOrientation,
  SliderHeadlessProps,
  SliderThumbProps,
  SliderProps,
  SliderThumbState,
  SliderRenderState,
} from "./Slider.types";

// ---------------------------------------------------------------------------
// Type compile-time assertions (Milestone 1 — types scaffold only)
// ---------------------------------------------------------------------------

describe("Slider types", () => {
  describe("SliderVariant", () => {
    test("accepts standard, centered, range", () => {
      expectTypeOf<"standard">().toMatchTypeOf<SliderVariant>();
      expectTypeOf<"centered">().toMatchTypeOf<SliderVariant>();
      expectTypeOf<"range">().toMatchTypeOf<SliderVariant>();
    });
  });

  describe("SliderSize", () => {
    test("accepts all five size literals", () => {
      expectTypeOf<"xsmall">().toMatchTypeOf<SliderSize>();
      expectTypeOf<"small">().toMatchTypeOf<SliderSize>();
      expectTypeOf<"medium">().toMatchTypeOf<SliderSize>();
      expectTypeOf<"large">().toMatchTypeOf<SliderSize>();
      expectTypeOf<"xlarge">().toMatchTypeOf<SliderSize>();
    });
  });

  describe("SliderOrientation", () => {
    test("accepts horizontal and vertical", () => {
      expectTypeOf<"horizontal">().toMatchTypeOf<SliderOrientation>();
      expectTypeOf<"vertical">().toMatchTypeOf<SliderOrientation>();
    });
  });

  describe("SliderHeadlessProps", () => {
    test("accepts aria-label, aria-labelledby, and label for accessible labelling", () => {
      expectTypeOf<SliderHeadlessProps>().toHaveProperty("aria-label");
      expectTypeOf<SliderHeadlessProps>().toHaveProperty("aria-labelledby");
      expectTypeOf<SliderHeadlessProps>().toHaveProperty("label");
    });

    test("aria-label is optional string", () => {
      expectTypeOf<SliderHeadlessProps["aria-label"]>().toEqualTypeOf<string | undefined>();
    });

    test("label is optional string", () => {
      expectTypeOf<SliderHeadlessProps["label"]>().toEqualTypeOf<string | undefined>();
    });
  });

  describe("SliderThumbProps", () => {
    test("requires index as number", () => {
      expectTypeOf<SliderThumbProps>().toHaveProperty("index");
      expectTypeOf<SliderThumbProps["index"]>().toEqualTypeOf<number>();
    });
  });

  describe("SliderProps", () => {
    test("extends SliderHeadlessProps (minus children)", () => {
      expectTypeOf<SliderProps>().toMatchTypeOf<Omit<SliderHeadlessProps, "children">>();
    });

    test("accepts size prop", () => {
      expectTypeOf<SliderProps>().toHaveProperty("size");
      expectTypeOf<SliderProps["size"]>().toEqualTypeOf<SliderSize | undefined>();
    });

    test("accepts showStops prop", () => {
      expectTypeOf<SliderProps>().toHaveProperty("showStops");
      expectTypeOf<SliderProps["showStops"]>().toEqualTypeOf<boolean | undefined>();
    });

    test("accepts showValueIndicator prop", () => {
      expectTypeOf<SliderProps>().toHaveProperty("showValueIndicator");
      expectTypeOf<SliderProps["showValueIndicator"]>().toEqualTypeOf<boolean | undefined>();
    });

    test("accepts icon prop as ReactNode", () => {
      expectTypeOf<SliderProps>().toHaveProperty("icon");
    });
  });

  describe("SliderThumbState", () => {
    test("accepts all four state literals", () => {
      expectTypeOf<"enabled">().toMatchTypeOf<SliderThumbState>();
      expectTypeOf<"hovered">().toMatchTypeOf<SliderThumbState>();
      expectTypeOf<"pressed">().toMatchTypeOf<SliderThumbState>();
      expectTypeOf<"disabled">().toMatchTypeOf<SliderThumbState>();
    });
  });

  describe("SliderRenderState", () => {
    test("has values array of numbers", () => {
      expectTypeOf<SliderRenderState>().toHaveProperty("values");
      expectTypeOf<SliderRenderState["values"]>().toEqualTypeOf<number[]>();
    });

    test("has percentages array of numbers", () => {
      expectTypeOf<SliderRenderState>().toHaveProperty("percentages");
      expectTypeOf<SliderRenderState["percentages"]>().toEqualTypeOf<number[]>();
    });

    test("has isDisabled boolean", () => {
      expectTypeOf<SliderRenderState["isDisabled"]>().toEqualTypeOf<boolean>();
    });

    test("has isDragging boolean", () => {
      expectTypeOf<SliderRenderState["isDragging"]>().toEqualTypeOf<boolean>();
    });

    test("has thumbStates array of SliderThumbState", () => {
      expectTypeOf<SliderRenderState["thumbStates"]>().toEqualTypeOf<SliderThumbState[]>();
    });
  });
});
