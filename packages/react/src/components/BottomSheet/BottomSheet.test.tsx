/**
 * BottomSheet — Milestone 1: Type and Export Foundation
 *
 * These tests are purely compile-time assertions (no rendering).
 * They validate the TypeScript contract defined in BottomSheet.types.ts
 * and will be expanded with render/behavior tests in subsequent milestones.
 */

import { describe, expectTypeOf, it } from "vitest";

import type {
  BottomSheetAnimationState,
  BottomSheetContextValue,
  BottomSheetHandleProps,
  BottomSheetHeadlessProps,
  BottomSheetProps,
  BottomSheetVariant,
} from "./BottomSheet.types";

// ─── BottomSheetVariant ───────────────────────────────────────────────────────

describe("BottomSheetVariant", () => {
  it("accepts standard and modal only", () => {
    expectTypeOf<"standard">().toMatchTypeOf<BottomSheetVariant>();
    expectTypeOf<"modal">().toMatchTypeOf<BottomSheetVariant>();
  });

  it("is a string union of exactly two members", () => {
    expectTypeOf<BottomSheetVariant>().toEqualTypeOf<"standard" | "modal">();
  });
});

// ─── BottomSheetAnimationState ────────────────────────────────────────────────

describe("BottomSheetAnimationState", () => {
  it("accepts all four expected string literals", () => {
    expectTypeOf<"entering">().toMatchTypeOf<BottomSheetAnimationState>();
    expectTypeOf<"visible">().toMatchTypeOf<BottomSheetAnimationState>();
    expectTypeOf<"exiting">().toMatchTypeOf<BottomSheetAnimationState>();
    expectTypeOf<"exited">().toMatchTypeOf<BottomSheetAnimationState>();
  });

  it("is a string union of exactly four members", () => {
    expectTypeOf<BottomSheetAnimationState>().toEqualTypeOf<
      "entering" | "visible" | "exiting" | "exited"
    >();
  });
});

// ─── BottomSheetContextValue ──────────────────────────────────────────────────

describe("BottomSheetContextValue", () => {
  it("has correct shape", () => {
    expectTypeOf<BottomSheetContextValue>().toHaveProperty("isOpen");
    expectTypeOf<BottomSheetContextValue>().toHaveProperty("variant");
    expectTypeOf<BottomSheetContextValue>().toHaveProperty("snapPoints");
    expectTypeOf<BottomSheetContextValue>().toHaveProperty("currentSnapIndex");
    expectTypeOf<BottomSheetContextValue>().toHaveProperty("isDragging");
    expectTypeOf<BottomSheetContextValue>().toHaveProperty("close");
    expectTypeOf<BottomSheetContextValue>().toHaveProperty("handleProps");
  });

  it("isOpen is boolean", () => {
    expectTypeOf<BottomSheetContextValue["isOpen"]>().toEqualTypeOf<boolean>();
  });

  it("variant is BottomSheetVariant", () => {
    expectTypeOf<BottomSheetContextValue["variant"]>().toEqualTypeOf<BottomSheetVariant>();
  });

  it("snapPoints is string array", () => {
    expectTypeOf<BottomSheetContextValue["snapPoints"]>().toEqualTypeOf<string[]>();
  });

  it("currentSnapIndex is number", () => {
    expectTypeOf<BottomSheetContextValue["currentSnapIndex"]>().toEqualTypeOf<number>();
  });

  it("isDragging is boolean", () => {
    expectTypeOf<BottomSheetContextValue["isDragging"]>().toEqualTypeOf<boolean>();
  });

  it("close is a void-returning function", () => {
    expectTypeOf<BottomSheetContextValue["close"]>().toEqualTypeOf<() => void>();
  });

  it('handleProps has role "button"', () => {
    expectTypeOf<BottomSheetContextValue["handleProps"]["role"]>().toEqualTypeOf<"button">();
  });

  it("handleProps has tabIndex number", () => {
    expectTypeOf<BottomSheetContextValue["handleProps"]["tabIndex"]>().toEqualTypeOf<number>();
  });
});

// ─── BottomSheetHeadlessProps ─────────────────────────────────────────────────

describe("BottomSheetHeadlessProps", () => {
  it("requires aria-label", () => {
    type RequiredKeys = {
      [K in keyof BottomSheetHeadlessProps]-?: undefined extends BottomSheetHeadlessProps[K]
        ? never
        : K;
    }[keyof BottomSheetHeadlessProps];

    expectTypeOf<"aria-label">().toMatchTypeOf<RequiredKeys>();
  });

  it("has optional variant defaulting to modal", () => {
    expectTypeOf<BottomSheetHeadlessProps["variant"]>().toEqualTypeOf<
      BottomSheetVariant | undefined
    >();
  });

  it("has optional open boolean", () => {
    expectTypeOf<BottomSheetHeadlessProps["open"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has optional defaultOpen boolean", () => {
    expectTypeOf<BottomSheetHeadlessProps["defaultOpen"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has optional snapPoints string array", () => {
    expectTypeOf<BottomSheetHeadlessProps["snapPoints"]>().toEqualTypeOf<string[] | undefined>();
  });

  it("has optional getAnimationClassName callback", () => {
    expectTypeOf<BottomSheetHeadlessProps["getAnimationClassName"]>().toEqualTypeOf<
      ((state: BottomSheetAnimationState) => string) | undefined
    >();
  });

  it("has optional className string", () => {
    expectTypeOf<BottomSheetHeadlessProps["className"]>().toEqualTypeOf<string | undefined>();
  });

  it("has optional scrimClassName string", () => {
    expectTypeOf<BottomSheetHeadlessProps["scrimClassName"]>().toEqualTypeOf<string | undefined>();
  });
});

// ─── BottomSheetProps ─────────────────────────────────────────────────────────

describe("BottomSheetProps", () => {
  it("requires aria-label", () => {
    type RequiredKeys = {
      [K in keyof BottomSheetProps]-?: undefined extends BottomSheetProps[K] ? never : K;
    }[keyof BottomSheetProps];

    expectTypeOf<"aria-label">().toMatchTypeOf<RequiredKeys>();
  });

  it("has optional variant", () => {
    expectTypeOf<BottomSheetProps["variant"]>().toEqualTypeOf<BottomSheetVariant | undefined>();
  });

  it("has optional snapPoints string array", () => {
    expectTypeOf<BottomSheetProps["snapPoints"]>().toEqualTypeOf<string[] | undefined>();
  });

  it("has optional className string", () => {
    expectTypeOf<BottomSheetProps["className"]>().toEqualTypeOf<string | undefined>();
  });
});

// ─── BottomSheetHandleProps ───────────────────────────────────────────────────

describe("BottomSheetHandleProps", () => {
  it("accepts an optional className", () => {
    expectTypeOf<BottomSheetHandleProps["className"]>().toEqualTypeOf<string | undefined>();
  });

  it("has no required props", () => {
    const _valid: BottomSheetHandleProps = {};
    expectTypeOf(_valid).toMatchTypeOf<BottomSheetHandleProps>();
  });
});
