/**
 * BottomSheet — Milestone 1–6
 *
 * M01: Compile-time type assertions (no rendering).
 * M02: Portal, state management, animation state machine, and context tests.
 * M03: Modal variant — dialog semantics, focus trap, scrim, Escape dismissal.
 * M04: Drag handle interaction and snap behavior.
 * M05: Styled layer — CVA tokens, scrim classes, handle classes.
 * M06: Motion and animation — slide animations, snap spring, reduced-motion guard.
 */

import { createRef, useState } from "react";
import { describe, expect, expectTypeOf, it, vi, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomSheetHeadless, useBottomSheetContext } from "./BottomSheetHeadless";
import { BottomSheet } from "./BottomSheet";
import { BottomSheetHandle } from "./BottomSheetHandle";
import { useReducedMotion } from "../../hooks/useReducedMotion";

vi.mock("../../hooks/useReducedMotion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

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

// ─── BottomSheetHeadless — modal variant behavior ─────────────────────────────

describe("BottomSheetHeadless — modal variant behavior", () => {
  it("modal variant: sheet panel has role='dialog'", () => {
    render(
      <BottomSheetHeadless variant="modal" open aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("modal variant: sheet panel has aria-modal='true'", () => {
    render(
      <BottomSheetHeadless variant="modal" open aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("modal variant: aria-label prop is applied to the dialog", () => {
    render(
      <BottomSheetHeadless variant="modal" open aria-label="Share options">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.getByRole("dialog", { name: "Share options" })).toBeInTheDocument();
  });

  it("modal variant: Escape key calls onOpenChange(false)", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <BottomSheetHeadless variant="modal" open onOpenChange={onOpenChange} aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("modal variant: scrim is rendered when open", () => {
    render(
      <BottomSheetHeadless variant="modal" open aria-label="Test sheet" scrimClassName="test-scrim">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.getByTestId("bottom-sheet-scrim")).toBeInTheDocument();
  });

  it("modal variant: scrim click calls onOpenChange(false)", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <BottomSheetHeadless variant="modal" open onOpenChange={onOpenChange} aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );

    await user.click(screen.getByTestId("bottom-sheet-scrim"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("modal variant: scrim is aria-hidden", () => {
    render(
      <BottomSheetHeadless variant="modal" open aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.getByTestId("bottom-sheet-scrim")).toHaveAttribute("aria-hidden", "true");
  });

  it("standard variant: does NOT have role='dialog'", () => {
    render(
      <BottomSheetHeadless variant="standard" open aria-label="Test sheet">
        Content
      </BottomSheetHeadless>
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("standard variant: does NOT render a scrim", () => {
    render(
      <BottomSheetHeadless
        variant="standard"
        open
        aria-label="Test sheet"
        scrimClassName="test-scrim"
      >
        Content
      </BottomSheetHeadless>
    );
    expect(screen.queryByTestId("bottom-sheet-scrim")).toBeNull();
  });

  it("modal variant: focus is trapped inside the sheet", async () => {
    const user = userEvent.setup();

    render(
      <BottomSheetHeadless variant="modal" open aria-label="Test sheet">
        <button type="button">Button 1</button>
        <button type="button">Button 2</button>
      </BottomSheetHeadless>
    );

    const dialog = screen.getByRole("dialog");
    const buttons = screen.getAllByRole("button");

    for (const _btn of buttons) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("BottomSheetContextValue has dragTranslateY field", () => {
    expectTypeOf<BottomSheetContextValue>().toHaveProperty("dragTranslateY");
    expectTypeOf<BottomSheetContextValue["dragTranslateY"]>().toEqualTypeOf<number | null>();
  });

  it("modal variant: focus returns to trigger element after close", async () => {
    const user = userEvent.setup();

    function TestComponent() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open Sheet
          </button>
          <BottomSheetHeadless
            variant="modal"
            open={open}
            onOpenChange={setOpen}
            aria-label="Test sheet"
          >
            <button type="button">Inside Sheet</button>
          </BottomSheetHeadless>
        </>
      );
    }

    render(<TestComponent />);

    const trigger = screen.getByText("Open Sheet");
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });
});

// ─── useBottomSheetDrag — drag and snap behavior ──────────────────────────────

describe("useBottomSheetDrag — drag and snap behavior", () => {
  function Handle() {
    const { handleProps } = useBottomSheetContext();
    return <div {...handleProps} data-testid="handle" />;
  }

  function ContextReader() {
    const ctx = useBottomSheetContext();
    return (
      <>
        <span data-testid="snapIndex">{ctx.currentSnapIndex}</span>
        <span data-testid="isDragging">{String(ctx.isDragging)}</span>
        <span data-testid="dragTranslateY">{String(ctx.dragTranslateY)}</span>
      </>
    );
  }

  // Test 24
  it("isDragging is false before any pointer interaction", () => {
    render(
      <BottomSheetHeadless open aria-label="Test sheet">
        <ContextReader />
      </BottomSheetHeadless>
    );
    expect(screen.getByTestId("isDragging").textContent).toBe("false");
  });

  // Test 25
  it("currentSnapIndex starts at 0 (first snap point)", () => {
    render(
      <BottomSheetHeadless open aria-label="Test sheet" snapPoints={["25%", "50%", "100%"]}>
        <ContextReader />
      </BottomSheetHeadless>
    );
    expect(screen.getByTestId("snapIndex").textContent).toBe("0");
  });

  // Test 26
  it("keyboard Space cycles to next snap point", async () => {
    const user = userEvent.setup();
    render(
      <BottomSheetHeadless open aria-label="Test sheet" snapPoints={["25%", "50%", "100%"]}>
        <Handle />
        <ContextReader />
      </BottomSheetHeadless>
    );
    screen.getByTestId("handle").focus();
    await user.keyboard(" ");
    expect(screen.getByTestId("snapIndex").textContent).toBe("1");
  });

  // Test 27
  it("keyboard Space wraps back to 0 from last snap point", async () => {
    const user = userEvent.setup();
    render(
      <BottomSheetHeadless open aria-label="Test sheet" snapPoints={["25%", "50%"]}>
        <Handle />
        <ContextReader />
      </BottomSheetHeadless>
    );
    screen.getByTestId("handle").focus();
    await user.keyboard(" ");
    expect(screen.getByTestId("snapIndex").textContent).toBe("1");
    await user.keyboard(" ");
    expect(screen.getByTestId("snapIndex").textContent).toBe("0");
  });

  // Test 28
  it("keyboard Enter cycles to next snap point (same as Space)", async () => {
    const user = userEvent.setup();
    render(
      <BottomSheetHeadless open aria-label="Test sheet" snapPoints={["25%", "50%", "100%"]}>
        <Handle />
        <ContextReader />
      </BottomSheetHeadless>
    );
    screen.getByTestId("handle").focus();
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("snapIndex").textContent).toBe("1");
  });

  // Test 29
  it("keyboard ArrowUp moves to higher snap point", async () => {
    const user = userEvent.setup();
    render(
      <BottomSheetHeadless open aria-label="Test sheet" snapPoints={["25%", "50%", "100%"]}>
        <Handle />
        <ContextReader />
      </BottomSheetHeadless>
    );
    screen.getByTestId("handle").focus();
    await user.keyboard(" ");
    expect(screen.getByTestId("snapIndex").textContent).toBe("1");
    await user.keyboard("{ArrowUp}");
    expect(screen.getByTestId("snapIndex").textContent).toBe("2");
  });

  // Test 30
  it("keyboard ArrowDown moves to lower snap point", async () => {
    const user = userEvent.setup();
    render(
      <BottomSheetHeadless open aria-label="Test sheet" snapPoints={["25%", "50%", "100%"]}>
        <Handle />
        <ContextReader />
      </BottomSheetHeadless>
    );
    screen.getByTestId("handle").focus();
    await user.keyboard(" ");
    expect(screen.getByTestId("snapIndex").textContent).toBe("1");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByTestId("snapIndex").textContent).toBe("0");
  });

  // Test 31
  it("keyboard ArrowDown at lowest snap point calls close", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(
      <BottomSheetHeadless
        open
        onOpenChange={onOpenChange}
        aria-label="Test sheet"
        snapPoints={["25%", "50%", "100%"]}
      >
        <Handle />
        <ContextReader />
      </BottomSheetHeadless>
    );
    screen.getByTestId("handle").focus();
    await user.keyboard("{ArrowDown}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // Test 32
  it("single snap point: Space does not change index (stays at 0)", async () => {
    const user = userEvent.setup();
    render(
      <BottomSheetHeadless open aria-label="Test sheet" snapPoints={["50%"]}>
        <Handle />
        <ContextReader />
      </BottomSheetHeadless>
    );
    screen.getByTestId("handle").focus();
    await user.keyboard(" ");
    expect(screen.getByTestId("snapIndex").textContent).toBe("0");
  });

  // Test 33
  it("dragTranslateY is null when not dragging", () => {
    render(
      <BottomSheetHeadless open aria-label="Test sheet">
        <ContextReader />
      </BottomSheetHeadless>
    );
    expect(screen.getByTestId("dragTranslateY").textContent).toBe("null");
  });
});

// ─── BottomSheet — styled layer ───────────────────────────────────────────────

describe("BottomSheet — styled layer", () => {
  // Test 34
  it("BottomSheet has bg-surface-container-low class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("bg-surface-container-low");
  });

  // Test 35
  it("BottomSheet has shadow-elevation-1 class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("shadow-elevation-1");
  });

  // Test 36
  it("BottomSheet has rounded-t-xl class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("rounded-t-xl");
  });

  // Test 37
  it("BottomSheet modal variant has z-50 class", () => {
    render(<BottomSheet variant="modal" open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("z-50");
  });

  // Test 38
  it("BottomSheet standard variant has z-10 class", () => {
    render(<BottomSheet variant="standard" open aria-label="Test" />);
    const panel = document.querySelector("[data-animation-state]");
    expect(panel).toHaveClass("z-10");
  });

  // Test 39
  it("BottomSheetHandle renders inside BottomSheet", () => {
    render(
      <BottomSheet open aria-label="Test">
        Content
      </BottomSheet>
    );
    // Handle wrapper has role="button" injected by handleProps
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // Test 40
  it("BottomSheetHandle pill has w-8 and h-1 classes", () => {
    render(<BottomSheet open aria-label="Test" />);
    const pill = document.querySelector('span[aria-hidden="true"]');
    expect(pill).toHaveClass("w-8");
    expect(pill).toHaveClass("h-1");
  });

  // Test 41
  it("BottomSheetHandle pill has bg-on-surface-variant class", () => {
    render(<BottomSheet open aria-label="Test" />);
    const pill = document.querySelector('span[aria-hidden="true"]');
    expect(pill).toHaveClass("bg-on-surface-variant");
  });

  // Test 42
  it("BottomSheetHandle pill has opacity-40 class", () => {
    render(<BottomSheet open aria-label="Test" />);
    const pill = document.querySelector('span[aria-hidden="true"]');
    expect(pill).toHaveClass("opacity-40");
  });

  // Test 43
  it("BottomSheetHandle wrapper has cursor-ns-resize class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("button")).toHaveClass("cursor-ns-resize");
  });

  // Test 44
  it("index.ts exports BottomSheet, BottomSheetHandle, BottomSheetHeadless", () => {
    expect(BottomSheet).toBeDefined();
    expect(BottomSheetHandle).toBeDefined();
    expect(BottomSheetHeadless).toBeDefined();
  });
});

// ─── BottomSheet — motion and animation ───────────────────────────────────────

describe("BottomSheet — motion and animation", () => {
  afterEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  // Test 45
  it("sheet panel has animate-md-slide-in-bottom class when visible", async () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    render(<BottomSheet open aria-label="Test" />);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toHaveClass("animate-md-slide-in-bottom");
    });
  });

  // Test 46
  it("sheet panel has animate-md-slide-out-bottom class when exiting", async () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const { rerender } = render(<BottomSheet open aria-label="Test" />);
    // Wait for 'visible' state (after the zero-delay timer)
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toHaveClass("animate-md-slide-in-bottom");
    });
    // Trigger close → state transitions to 'exiting'
    rerender(<BottomSheet open={false} aria-label="Test" />);
    await waitFor(() => {
      const panel = document.querySelector('[data-animation-state="exiting"]');
      expect(panel).not.toBeNull();
      expect(panel).toHaveClass("animate-md-slide-out-bottom");
    });
  });

  // Test 47
  it("scrim has transition-opacity class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByTestId("bottom-sheet-scrim")).toHaveClass("transition-opacity");
  });

  // Test 48
  it("scrim has duration-short4 class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByTestId("bottom-sheet-scrim")).toHaveClass("duration-short4");
  });

  // Test 49
  it("scrim has ease-standard class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByTestId("bottom-sheet-scrim")).toHaveClass("ease-standard");
  });

  // Test 50
  it("sheet panel has transition-[height] class for snap spring", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("transition-[height]");
  });

  // Test 51
  it("sheet panel has duration-spring-standard-default-spatial class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("duration-spring-standard-default-spatial");
  });

  // Test 52
  it("sheet panel has ease-spring-standard-default-spatial class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("ease-spring-standard-default-spatial");
  });

  // Test 53
  it("reduced motion: no animation classes applied when useReducedMotion returns true", async () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<BottomSheet open aria-label="Test" />);
    await waitFor(() => {
      const panel = screen.getByRole("dialog");
      expect(panel).not.toHaveClass("animate-md-slide-in-bottom");
    });
  });

  // Test 54
  it("reduced motion: sheet appears without transform when reduced motion preferred", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("transition-none");
  });
});

// ─── BottomSheet — accessibility ──────────────────────────────────────────────

import { axe } from "vitest-axe";

describe("BottomSheet — accessibility", () => {
  // Test 55
  it('drag handle has role="button"', () => {
    render(<BottomSheet open aria-label="Test sheet" />);
    expect(screen.getByRole("button", { name: /adjust sheet height/i })).toBeInTheDocument();
  });

  // Test 56
  it('drag handle has default aria-label "Adjust sheet height"', () => {
    render(<BottomSheet open aria-label="Test sheet" />);
    const handle = screen.getByTestId("bottom-sheet-handle");
    expect(handle).toHaveAttribute("aria-label", "Adjust sheet height");
  });

  // Test 57
  it("drag handle accepts custom aria-label override", () => {
    render(
      <BottomSheet open aria-label="Test sheet">
        <BottomSheetHandle aria-label="Adjust player height" />
      </BottomSheet>
    );
    expect(screen.getByRole("button", { name: "Adjust player height" })).toBeInTheDocument();
  });

  // Test 58
  it("drag handle has tabIndex={0}", () => {
    render(<BottomSheet open aria-label="Test sheet" />);
    const handle = screen.getByTestId("bottom-sheet-handle");
    expect(handle).toHaveAttribute("tabindex", "0");
  });

  // Test 59
  it("drag handle has focus-visible:ring-3 class", () => {
    render(<BottomSheet open aria-label="Test sheet" />);
    const handle = screen.getByTestId("bottom-sheet-handle");
    expect(handle).toHaveClass("focus-visible:ring-3");
  });

  // Test 60
  it("drag handle has focus-visible:ring-secondary class", () => {
    render(<BottomSheet open aria-label="Test sheet" />);
    const handle = screen.getByTestId("bottom-sheet-handle");
    expect(handle).toHaveClass("focus-visible:ring-secondary");
  });

  // Test 61
  it("drag handle has aria-valuenow reflecting currentSnapIndex", () => {
    render(<BottomSheet open aria-label="Test sheet" snapPoints={["25%", "50%", "100%"]} />);
    const handle = screen.getByTestId("bottom-sheet-handle");
    expect(handle).toHaveAttribute("aria-valuenow", "0");
  });

  // Test 62
  it("drag handle has aria-valuemin={0} and aria-valuemax={snapPoints.length - 1}", () => {
    render(<BottomSheet open aria-label="Test sheet" snapPoints={["25%", "50%", "100%"]} />);
    const handle = screen.getByTestId("bottom-sheet-handle");
    expect(handle).toHaveAttribute("aria-valuemin", "0");
    expect(handle).toHaveAttribute("aria-valuemax", "2");
  });

  // Test 63
  it('drag handle has aria-orientation="vertical"', () => {
    render(<BottomSheet open aria-label="Test sheet" />);
    const handle = screen.getByTestId("bottom-sheet-handle");
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
  });

  // Test 64
  it("Tab key moves focus to drag handle on sheet open (modal variant)", async () => {
    const user = userEvent.setup();
    render(<BottomSheet variant="modal" open aria-label="Test sheet" />);
    // FocusScope autoFocus focuses the dialog container first (tabIndex=-1 from useDialog).
    // One Tab keystroke moves to the first tabbable element: the drag handle (tabIndex=0).
    await user.tab();
    expect(document.activeElement).toBe(screen.getByTestId("bottom-sheet-handle"));
  });

  // Test 65
  it("axe: modal variant open — zero violations", async () => {
    const { container } = render(
      <BottomSheet variant="modal" open aria-label="Test modal sheet" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test 66
  it("axe: standard variant open — zero violations", async () => {
    const { container } = render(
      <BottomSheet variant="standard" open aria-label="Test standard sheet" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── BottomSheet — panel snap height and drag style ───────────────────────────

describe("BottomSheet — panel snap height and drag style", () => {
  // Test 67
  it("modal panel has height style equal to first snap point on open", () => {
    render(<BottomSheet open aria-label="Test" snapPoints={["50%"]} />);
    expect(screen.getByRole("dialog")).toHaveStyle({ height: "50%" });
  });

  // Test 68
  it("standard panel has height style equal to first snap point on open", () => {
    render(<BottomSheet variant="standard" open aria-label="Test" snapPoints={["40%"]} />);
    const panel = document.querySelector("[data-animation-state]");
    expect(panel).toHaveStyle({ height: "40%" });
  });

  // Test 69
  it("modal panel has data-dragging=true while handle is being dragged", () => {
    render(<BottomSheet open aria-label="Test" snapPoints={["50%"]} />);
    const handle = screen.getByTestId("bottom-sheet-handle");
    handle.setPointerCapture = vi.fn();
    // Wrap in act so React flushes setIsDragging(true) before the assertion
    act(() => {
      handle.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    });
    expect(screen.getByRole("dialog")).toHaveAttribute("data-dragging", "true");
  });

  // Test 70
  it("standard panel has data-dragging=true while handle is being dragged", () => {
    render(<BottomSheet variant="standard" open aria-label="Test" snapPoints={["50%"]} />);
    const handle = screen.getByTestId("bottom-sheet-handle");
    handle.setPointerCapture = vi.fn();
    act(() => {
      handle.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    });
    const panel = document.querySelector("[data-animation-state]");
    expect(panel).toHaveAttribute("data-dragging", "true");
  });

  // Test 71: Verify dragTranslateY in context becomes a finite number during drag.
  // We dispatch events as MouseEvent (not PointerEvent) because JSDOM correctly
  // propagates clientY through MouseEventInit, whereas PointerEventInit support is incomplete.
  it("dragTranslateY in context updates to a finite number during active drag", async () => {
    function DragYReader() {
      const { dragTranslateY } = useBottomSheetContext();
      return <span data-testid="drag-y">{String(dragTranslateY)}</span>;
    }

    render(
      <BottomSheet open aria-label="Test" snapPoints={["50%"]}>
        <DragYReader />
      </BottomSheet>
    );

    const handle = screen.getByTestId("bottom-sheet-handle");
    handle.setPointerCapture = vi.fn();

    // Before drag: dragTranslateY is null
    expect(screen.getByTestId("drag-y").textContent).toBe("null");

    // Start drag — clientY=200 correctly sets startYRef via MouseEventInit
    act(() => {
      handle.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientY: 200 }));
    });

    // Wait for isDragging to propagate to the panel
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toHaveAttribute("data-dragging", "true");
    });

    // Dispatch pointermove — deltaY = 300 - 200 = 100 → dragTranslateY = 100
    act(() => {
      window.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientY: 300 }));
    });

    // dragTranslateY should now be a finite number
    await waitFor(() => {
      const dragY = screen.getByTestId("drag-y").textContent;
      expect(dragY).not.toBe("null");
      expect(Number.isFinite(Number(dragY))).toBe(true);
    });

    // Panel height reflects the drag offset using height: calc(snapHeight - delta)
    await waitFor(() => {
      const heightStyle = screen.getByRole("dialog").style.height;
      expect(heightStyle).toContain("calc(");
    });
  });

  // Test 72
  it("panel data-dragging is absent after pointer is released", () => {
    render(<BottomSheet open aria-label="Test" snapPoints={["50%"]} />);
    const handle = screen.getByTestId("bottom-sheet-handle");
    handle.setPointerCapture = vi.fn();
    handle.releasePointerCapture = vi.fn();
    act(() => {
      handle.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    });
    expect(screen.getByRole("dialog")).toHaveAttribute("data-dragging", "true");
    fireEvent.pointerUp(handle, { clientY: 200, pointerId: 1 });
    expect(screen.getByRole("dialog")).not.toHaveAttribute("data-dragging");
  });
});

// ─── BottomSheet — bottom anchoring and max-height ────────────────────────────

describe("BottomSheet — bottom anchoring and max-height", () => {
  // Test 73
  it("sheet panel does NOT have sm:top-14 class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).not.toHaveClass("sm:top-14");
  });

  // Test 74
  it("sheet panel does NOT have sm:bottom-auto class", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).not.toHaveClass("sm:bottom-auto");
  });

  // Test 75
  it("sheet panel has max-h-[calc(100vh-72px)] class for default top margin", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-h-[calc(100vh-72px)]");
  });

  // Test 76
  it("sheet panel has sm:max-h-[calc(100vh-56px)] class for wide-viewport top margin", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("sm:max-h-[calc(100vh-56px)]");
  });

  // Test 77 — centering
  it("sheet panel does NOT have sm:mx-14 class (uses mx-auto for centering)", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).not.toHaveClass("sm:mx-14");
  });

  // Test 78
  it("sheet panel has mx-auto class for horizontal centering", () => {
    render(<BottomSheet open aria-label="Test" />);
    expect(screen.getByRole("dialog")).toHaveClass("mx-auto");
  });
});
