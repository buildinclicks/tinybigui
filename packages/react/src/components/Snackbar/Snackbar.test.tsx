import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Snackbar } from "./Snackbar";
import { SnackbarHeadless } from "./SnackbarHeadless";
import { SnackbarProvider, useSnackbar } from "./SnackbarProvider";
import type { SnackbarPosition, SnackbarProps } from "./Snackbar.types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderSnackbar = (props: Partial<SnackbarProps> = {}) =>
  render(
    <SnackbarProvider>
      <Snackbar message="File deleted" {...props} />
    </SnackbarProvider>
  );

/**
 * Advance fake timers through all phases of the auto-dismiss lifecycle:
 * 1. entering → visible (two rAF frames ≈ 32ms fires, React re-renders)
 * 2. visible → exiting (dismiss timer fires)
 * 3. exiting → exited (250ms exit fallback fires → onClose called)
 *
 * Each phase is wrapped in its own act() to ensure React flushes state
 * updates between phases. Must be called with vi.useFakeTimers() active.
 *
 * The 32ms advance covers the double requestAnimationFrame used to trigger
 * the entry animation. With vi.useFakeTimers(), rAF is faked as setTimeout(~16ms),
 * so two frames require advancing by at least 32ms.
 */
function advanceAndFinishExit(durationMs: number): void {
  act(() => {
    vi.advanceTimersByTime(32);
  }); // entering → visible (double rAF: 2 × ~16ms)
  act(() => {
    vi.advanceTimersByTime(durationMs);
  }); // visible → exiting
  act(() => {
    vi.advanceTimersByTime(300);
  }); // exit fallback fires (250ms + buffer)
}

const renderWithQueue = () => {
  const TriggerComponent = () => {
    const { showSnackbar } = useSnackbar();
    return (
      <div>
        <button onClick={() => showSnackbar({ message: "First", duration: 3000 })}>
          Show First
        </button>
        <button onClick={() => showSnackbar({ message: "Second", duration: 3000 })}>
          Show Second
        </button>
        <button onClick={() => showSnackbar({ message: "Third", duration: 3000 })}>
          Show Third
        </button>
      </div>
    );
  };
  return render(
    <SnackbarProvider>
      <TriggerComponent />
    </SnackbarProvider>
  );
};

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("Snackbar", () => {
  describe("Rendering", () => {
    test("renders single-line message", () => {
      renderSnackbar({ message: "File deleted" });
      expect(screen.getByText("File deleted")).toBeInTheDocument();
    });

    test("renders two-line message with supporting text", () => {
      renderSnackbar({
        message: "Connection lost",
        supportingText: "Please check your network",
      });
      expect(screen.getByText("Connection lost")).toBeInTheDocument();
      expect(screen.getByText("Please check your network")).toBeInTheDocument();
    });

    test("renders action button when action prop is provided", () => {
      renderSnackbar({
        message: "File deleted",
        action: { label: "Undo", onAction: vi.fn() },
      });
      expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    });

    test("does not render action button when action prop is absent", () => {
      renderSnackbar({ message: "File deleted" });
      expect(screen.queryByRole("button", { name: /undo/i })).not.toBeInTheDocument();
    });

    test("renders close icon button when showClose is true", () => {
      renderSnackbar({ message: "File deleted", showClose: true });
      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });

    test("does not render close icon button when showClose is false", () => {
      renderSnackbar({ message: "File deleted", showClose: false });
      expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument();
    });

    test("renders both action button and close icon when both props provided", () => {
      renderSnackbar({
        message: "File deleted",
        action: { label: "Undo", onAction: vi.fn() },
        showClose: true,
      });
      expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });

    test("merges custom className onto container", () => {
      renderSnackbar({ message: "Hello", className: "my-custom-class" });
      const container = screen.getByRole("status");
      expect(container).toHaveClass("my-custom-class");
    });

    test("forwards ref to container element", () => {
      const ref = { current: null };
      render(
        <SnackbarProvider>
          <Snackbar message="Hello" ref={ref} />
        </SnackbarProvider>
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  // ---------------------------------------------------------------------------
  // Accessibility
  // ---------------------------------------------------------------------------

  describe("Accessibility", () => {
    test("has role=status and aria-live=polite for default severity", () => {
      renderSnackbar({ message: "File deleted", severity: "default" });
      const el = screen.getByRole("status");
      expect(el).toHaveAttribute("aria-live", "polite");
      expect(el).toHaveAttribute("aria-atomic", "true");
    });

    test("has role=alert and aria-live=assertive for error severity", () => {
      renderSnackbar({ message: "Upload failed", severity: "error" });
      const el = screen.getByRole("alert");
      expect(el).toHaveAttribute("aria-live", "assertive");
    });

    test("action button has an accessible name", () => {
      renderSnackbar({
        message: "File deleted",
        action: { label: "Undo", onAction: vi.fn() },
      });
      const btn = screen.getByRole("button", { name: "Undo" });
      expect(btn).toBeInTheDocument();
    });

    test("close icon button has an accessible label", () => {
      renderSnackbar({ message: "File deleted", showClose: true });
      const closeBtn = screen.getByRole("button", { name: /close/i });
      expect(closeBtn).toHaveAttribute("aria-label");
    });

    test("single-line default snackbar has no axe violations", async () => {
      const { container } = renderSnackbar({ message: "File deleted" });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("snackbar with action has no axe violations", async () => {
      const { container } = renderSnackbar({
        message: "File deleted",
        action: { label: "Undo", onAction: vi.fn() },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("snackbar with close icon has no axe violations", async () => {
      const { container } = renderSnackbar({
        message: "File deleted",
        showClose: true,
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("error severity snackbar has no axe violations", async () => {
      const { container } = renderSnackbar({
        message: "Upload failed",
        severity: "error",
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ---------------------------------------------------------------------------
  // Auto-dismiss
  // ---------------------------------------------------------------------------

  describe("Auto-dismiss", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("calls onClose after default 4000ms duration", () => {
      const onClose = vi.fn();
      renderSnackbar({ message: "File deleted", onClose });

      expect(onClose).not.toHaveBeenCalled();
      advanceAndFinishExit(4000);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test("calls onClose after custom duration", () => {
      const onClose = vi.fn();
      renderSnackbar({ message: "Quick message", duration: 2000, onClose });

      advanceAndFinishExit(2000);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test("does not auto-dismiss when duration is 0", () => {
      const onClose = vi.fn();
      renderSnackbar({ message: "Persistent", duration: 0, onClose });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    test("does not auto-dismiss before duration elapses", () => {
      const onClose = vi.fn();
      renderSnackbar({ message: "File deleted", duration: 4000, onClose });

      // Flush entering→visible (double rAF ≈ 32ms) then advance to just before dismiss
      act(() => {
        vi.advanceTimersByTime(32);
      });
      act(() => {
        vi.advanceTimersByTime(3999);
      });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Pause on hover
  // ---------------------------------------------------------------------------

  describe("Pause on hover", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("pauses auto-dismiss timer on mouseenter", () => {
      const onClose = vi.fn();
      renderSnackbar({ message: "File deleted", duration: 4000, onClose });

      const el = screen.getByRole("status");

      // Flush entering→visible (double rAF ≈ 32ms) so event handlers see animationState="visible"
      act(() => {
        vi.advanceTimersByTime(32);
      });
      // Advance 2s
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      // Hover — pauses timer (separate act so React state is flushed before event)
      act(() => {
        fireEvent.mouseEnter(el);
      });
      // Advance past original duration — should NOT fire
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    test("resumes auto-dismiss timer on mouseleave", () => {
      const onClose = vi.fn();
      renderSnackbar({ message: "File deleted", duration: 4000, onClose });

      const el = screen.getByRole("status");

      // Flush entering→visible (double rAF ≈ 32ms)
      act(() => {
        vi.advanceTimersByTime(32);
      });
      // Advance 2s (2000ms consumed, 2000ms remaining)
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      // Hover
      act(() => {
        fireEvent.mouseEnter(el);
      });
      // Leave — resumes timer with remaining 2000ms
      act(() => {
        fireEvent.mouseLeave(el);
      });
      // Advance past remaining 2000ms → exit triggered
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      // Advance past 250ms exit fallback
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------------------
  // Pause on focus
  // ---------------------------------------------------------------------------

  describe("Pause on focus", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("pauses auto-dismiss timer on focus", () => {
      const onClose = vi.fn();
      renderSnackbar({ message: "File deleted", duration: 4000, onClose });

      const el = screen.getByRole("status");

      // Flush entering→visible (double rAF ≈ 32ms)
      act(() => {
        vi.advanceTimersByTime(32);
      });
      // Advance 1s
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      // Focus — pauses timer
      act(() => {
        fireEvent.focus(el);
      });
      // Advance 5s more — should NOT fire since paused
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    test("resumes auto-dismiss timer on blur", () => {
      const onClose = vi.fn();
      renderSnackbar({ message: "File deleted", duration: 4000, onClose });

      const el = screen.getByRole("status");

      // Flush entering→visible (double rAF ≈ 32ms)
      act(() => {
        vi.advanceTimersByTime(32);
      });
      // Advance 1s (1000ms consumed, 3000ms remaining)
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      // Focus — pauses timer
      act(() => {
        fireEvent.focus(el);
      });
      // Blur — resumes timer
      act(() => {
        fireEvent.blur(el);
      });
      // Advance past remaining 3000ms
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      // Advance past 250ms exit fallback
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------------------
  // Action callback
  // ---------------------------------------------------------------------------

  describe("Action callback", () => {
    test("fires onAction when action button is pressed", async () => {
      const onAction = vi.fn();
      renderSnackbar({
        message: "File deleted",
        action: { label: "Undo", onAction },
      });

      await userEvent.click(screen.getByRole("button", { name: "Undo" }));
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    test("does not fire onAction when action is not provided", () => {
      renderSnackbar({ message: "File deleted" });
      expect(screen.queryByRole("button", { name: /undo/i })).not.toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Close icon
  // ---------------------------------------------------------------------------

  describe("Close icon", () => {
    test("fires onClose when close icon button is pressed", () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      renderSnackbar({ message: "File deleted", showClose: true, onClose });

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: /close/i }));
      });

      // Advance past the 250ms exit fallback timer
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    test("close button is keyboard accessible", () => {
      renderSnackbar({ message: "File deleted", showClose: true });
      const closeBtn = screen.getByRole("button", { name: /close/i });
      expect(closeBtn.tagName).toBe("BUTTON");
    });
  });

  // ---------------------------------------------------------------------------
  // Animation
  // ---------------------------------------------------------------------------

  describe("Animation states", () => {
    test("container starts with entering animation class", () => {
      renderSnackbar({ message: "Hello" });
      const el = screen.getByRole("status");
      expect(el.className).toMatch(/transition/);
    });

    test("container applies opacity class for visibility", () => {
      renderSnackbar({ message: "Hello" });
      const el = screen.getByRole("status");
      expect(el.className).toMatch(/opacity/);
    });
  });

  // ---------------------------------------------------------------------------
  // Position
  // ---------------------------------------------------------------------------

  describe("Position", () => {
    // Position classes are now applied to the stack container (parent of the
    // snackbar element), rendered via the portal by SnackbarProvider. Tests
    // must trigger snackbars through the queue so the container exists.

    function renderWithPosition(position: string) {
      const TriggerComponent = () => {
        const { showSnackbar } = useSnackbar();
        return (
          <button
            onClick={() =>
              showSnackbar({ message: "Hello", position: position as SnackbarPosition })
            }
          >
            Trigger
          </button>
        );
      };
      render(
        <SnackbarProvider>
          <TriggerComponent />
        </SnackbarProvider>
      );
    }

    test("defaults to bottom-center position classes", async () => {
      renderWithPosition("bottom-center");
      await userEvent.click(screen.getByRole("button", { name: "Trigger" }));
      const container = screen.getByRole("status").parentElement!;
      expect(container.className).toMatch(/bottom-4/);
      expect(container.className).toMatch(/left-1\/2/);
    });

    test("applies bottom-left position classes", async () => {
      renderWithPosition("bottom-left");
      await userEvent.click(screen.getByRole("button", { name: "Trigger" }));
      const container = screen.getByRole("status").parentElement!;
      expect(container.className).toMatch(/bottom-4/);
      expect(container.className).toMatch(/left-4/);
    });

    test("applies bottom-right position classes", async () => {
      renderWithPosition("bottom-right");
      await userEvent.click(screen.getByRole("button", { name: "Trigger" }));
      const container = screen.getByRole("status").parentElement!;
      expect(container.className).toMatch(/bottom-4/);
      expect(container.className).toMatch(/right-4/);
    });

    test("applies top-center position classes", async () => {
      renderWithPosition("top-center");
      await userEvent.click(screen.getByRole("button", { name: "Trigger" }));
      const container = screen.getByRole("status").parentElement!;
      expect(container.className).toMatch(/top-4/);
      expect(container.className).toMatch(/left-1\/2/);
    });

    test("applies top-left position classes", async () => {
      renderWithPosition("top-left");
      await userEvent.click(screen.getByRole("button", { name: "Trigger" }));
      const container = screen.getByRole("status").parentElement!;
      expect(container.className).toMatch(/top-4/);
      expect(container.className).toMatch(/left-4/);
    });

    test("applies top-right position classes", async () => {
      renderWithPosition("top-right");
      await userEvent.click(screen.getByRole("button", { name: "Trigger" }));
      const container = screen.getByRole("status").parentElement!;
      expect(container.className).toMatch(/top-4/);
      expect(container.className).toMatch(/right-4/);
    });

    test("bottom positions enter with scale-75 and origin-bottom (zoom-in from bottom)", () => {
      renderSnackbar({ message: "Hello", position: "bottom-center" });
      const el = screen.getByRole("status");
      // In entering state (before the zero-delay setTimeout fires), the snackbar
      // starts at scale-75 + opacity-0, anchored at origin-bottom for the zoom.
      expect(el.className).toMatch(/scale-75/);
      expect(el.className).toMatch(/origin-bottom/);
    });

    test("top positions enter with scale-75 and origin-top (zoom-in from top)", () => {
      renderSnackbar({ message: "Hello", position: "top-center" });
      const el = screen.getByRole("status");
      // In entering state with "down" direction, scale anchors at origin-top.
      expect(el.className).toMatch(/scale-75/);
      expect(el.className).toMatch(/origin-top/);
    });
  });

  // ---------------------------------------------------------------------------
  // Queue ordering
  // ---------------------------------------------------------------------------

  describe("Queue ordering", () => {
    // Queue display tests use real timers with userEvent for reliability.
    // The "shows second after first" test uses fake timers for the timer phase.

    test("shows first snackbar immediately", async () => {
      renderWithQueue();

      await userEvent.click(screen.getByRole("button", { name: "Show First" }));

      expect(screen.getByText("First")).toBeInTheDocument();
    });

    test("shows multiple snackbars simultaneously (stacking)", async () => {
      renderWithQueue();

      await userEvent.click(screen.getByRole("button", { name: "Show First" }));
      await userEvent.click(screen.getByRole("button", { name: "Show Second" }));

      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    test("shows all three snackbars simultaneously when stacked", async () => {
      renderWithQueue();

      await userEvent.click(screen.getByRole("button", { name: "Show First" }));
      await userEvent.click(screen.getByRole("button", { name: "Show Second" }));
      await userEvent.click(screen.getByRole("button", { name: "Show Third" }));

      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
      expect(screen.getByText("Third")).toBeInTheDocument();
    });

    test("dismisses individual snackbars independently", () => {
      vi.useFakeTimers();

      // Use a component that lets us trigger two snackbars with different durations
      const TriggerComponent = () => {
        const { showSnackbar } = useSnackbar();
        return (
          <div>
            <button onClick={() => showSnackbar({ message: "Short", duration: 1000 })}>
              Show Short
            </button>
            <button onClick={() => showSnackbar({ message: "Long", duration: 10000 })}>
              Show Long
            </button>
          </div>
        );
      };
      render(
        <SnackbarProvider>
          <TriggerComponent />
        </SnackbarProvider>
      );

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Show Short" }));
      });
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Show Long" }));
      });

      // Both should be visible immediately
      expect(screen.getByText("Short")).toBeInTheDocument();
      expect(screen.getByText("Long")).toBeInTheDocument();

      // Advance only past the Short snackbar's duration (1000ms) + exit fallback
      advanceAndFinishExit(1000);

      vi.useRealTimers();

      // Long should still be visible, Short should be gone
      expect(screen.getByText("Long")).toBeInTheDocument();
      expect(screen.queryByText("Short")).not.toBeInTheDocument();
    });

    test("respects maxVisible cap — excess snackbars are hidden until space opens", async () => {
      const TriggerComponent = () => {
        const { showSnackbar } = useSnackbar();
        return (
          <div>
            {["A", "B", "C"].map((label) => (
              <button
                key={label}
                onClick={() => showSnackbar({ message: `Message ${label}`, duration: 3000 })}
              >
                {`Show ${label}`}
              </button>
            ))}
          </div>
        );
      };
      render(
        <SnackbarProvider maxVisible={2}>
          <TriggerComponent />
        </SnackbarProvider>
      );

      await userEvent.click(screen.getByRole("button", { name: "Show A" }));
      await userEvent.click(screen.getByRole("button", { name: "Show B" }));
      await userEvent.click(screen.getByRole("button", { name: "Show C" }));

      expect(screen.getByText("Message A")).toBeInTheDocument();
      expect(screen.getByText("Message B")).toBeInTheDocument();
      expect(screen.queryByText("Message C")).not.toBeInTheDocument();
    });

    test("useSnackbar throws when used outside SnackbarProvider", () => {
      const BadConsumer = () => {
        useSnackbar();
        return null;
      };

      expect(() => render(<BadConsumer />)).toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // SnackbarHeadless
  // ---------------------------------------------------------------------------

  describe("SnackbarHeadless", () => {
    test("renders with role=status for default severity", () => {
      render(<SnackbarHeadless message="Hello" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    test("renders with role=alert for error severity", () => {
      render(<SnackbarHeadless message="Error" severity="error" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    test("has aria-live=polite for default severity", () => {
      render(<SnackbarHeadless message="Hello" />);
      expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    });

    test("has aria-live=assertive for error severity", () => {
      render(<SnackbarHeadless message="Error" severity="error" />);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
    });

    test("has aria-atomic=true", () => {
      render(<SnackbarHeadless message="Hello" />);
      expect(screen.getByRole("status")).toHaveAttribute("aria-atomic", "true");
    });

    test("renders ReactNode children", () => {
      render(
        <SnackbarHeadless message="Hello">
          <span data-testid="custom-child">Custom content</span>
        </SnackbarHeadless>
      );
      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    });

    test("renders children as render function with animationState", () => {
      const renderFn = vi.fn((_state: { animationState: string; onClose: () => void }) => (
        <span>rendered</span>
      ));
      render(<SnackbarHeadless message="Hello">{renderFn}</SnackbarHeadless>);
      const calls = renderFn.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      expect(typeof (calls[0]?.[0] as { animationState: string }).animationState).toBe("string");
    });

    test("forwards ref to container element", () => {
      const ref = { current: null };
      render(<SnackbarHeadless message="Hello" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    test("applies custom className to container", () => {
      render(<SnackbarHeadless message="Hello" className="custom-headless" />);
      expect(screen.getByRole("status")).toHaveClass("custom-headless");
    });

    describe("Auto-dismiss timer", () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      test("calls onClose after duration", () => {
        const onClose = vi.fn();
        render(<SnackbarHeadless message="Hello" duration={2000} onClose={onClose} />);

        advanceAndFinishExit(2000);

        expect(onClose).toHaveBeenCalledTimes(1);
      });

      test("does not call onClose when duration is 0", () => {
        const onClose = vi.fn();
        render(<SnackbarHeadless message="Hello" duration={0} onClose={onClose} />);

        act(() => {
          vi.advanceTimersByTime(10000);
        });

        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });
});
