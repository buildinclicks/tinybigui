/**
 * BottomSheet — Milestone 1 + Milestone 2 + Milestone 3
 *
 * M01: Compile-time type assertions (no rendering).
 * M02: Portal, state management, animation state machine, and context tests.
 * M03: Modal variant — dialog semantics, focus trap, scrim, Escape dismissal.
 */

import { createRef, useState } from "react";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
