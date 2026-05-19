/**
 * BottomSheet — Milestone 1 + Milestone 2
 *
 * M01: Compile-time type assertions (no rendering).
 * M02: Portal, state management, animation state machine, and context tests.
 */

import { createRef } from "react";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BottomSheetHeadless, useBottomSheetContext } from "./BottomSheetHeadless";

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

// ─── BottomSheetHeadless — portal and state ───────────────────────────────────

describe("BottomSheetHeadless — portal and state", () => {
  it("renders sheet content when open={true}", () => {
    render(
      <BottomSheetHeadless open aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render sheet content when open={false}", () => {
    render(
      <BottomSheetHeadless open={false} aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.queryByText("Content")).toBeNull();
  });

  it("portals content to document.body", () => {
    render(
      <BottomSheetHeadless open aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(document.body).toContainElement(screen.getByText("Content"));
  });

  it("controlled: open prop controls visibility", () => {
    const { rerender } = render(
      <BottomSheetHeadless open={false} aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.queryByText("Content")).toBeNull();

    rerender(
      <BottomSheetHeadless open={true} aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("uncontrolled: defaultOpen={true} starts open", () => {
    render(
      <BottomSheetHeadless defaultOpen aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("uncontrolled: defaultOpen omitted starts closed", () => {
    render(<BottomSheetHeadless aria-label="Test sheet">Content</BottomSheetHeadless>);
    expect(screen.queryByText("Content")).toBeNull();
  });

  it("onOpenChange is called when close() is triggered", () => {
    function Closer() {
      const { close } = useBottomSheetContext();
      return <button onClick={close}>Close</button>;
    }

    const onOpenChange = vi.fn();
    render(
      <BottomSheetHeadless open onOpenChange={onOpenChange} aria-label="Test sheet">
        <Closer />
      </BottomSheetHeadless>
    );
    fireEvent.click(screen.getByText("Close"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("forwardRef attaches ref to the sheet panel element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <BottomSheetHeadless open ref={ref} aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('displayName is set to "BottomSheetHeadless"', () => {
    expect(BottomSheetHeadless.displayName).toBe("BottomSheetHeadless");
  });

  it("BottomSheetContext is provided to children", () => {
    function ContextReader() {
      const ctx = useBottomSheetContext();
      return (
        <div>
          <span data-testid="isOpen">{String(ctx.isOpen)}</span>
          <span data-testid="variant">{ctx.variant}</span>
          <span data-testid="snapPoints">{ctx.snapPoints.join(",")}</span>
        </div>
      );
    }

    render(
      <BottomSheetHeadless open aria-label="Test sheet" snapPoints={["50%", "100%"]}>
        <ContextReader />
      </BottomSheetHeadless>
    );
    expect(screen.getByTestId("isOpen").textContent).toBe("true");
    expect(screen.getByTestId("variant").textContent).toBe("modal");
    expect(screen.getByTestId("snapPoints").textContent).toBe("50%,100%");
  });

  it("data-animation-state attribute is present on the panel", () => {
    render(
      <BottomSheetHeadless open aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    const panel = document.querySelector("[data-animation-state]");
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("data-animation-state");
  });

  it("snapPoints default is ['50%'] when not provided", () => {
    function SnapReader() {
      const { snapPoints } = useBottomSheetContext();
      return <span data-testid="snaps">{snapPoints.join(",")}</span>;
    }

    render(
      <BottomSheetHeadless open aria-label="Test sheet">
        <SnapReader />
      </BottomSheetHeadless>
    );
    expect(screen.getByTestId("snaps").textContent).toBe("50%");
  });
});
