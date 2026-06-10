import { useState, type ComponentProps } from "react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Dialog } from "./Dialog";
import { DialogHeadline } from "./DialogHeadline";
import { DialogContent } from "./DialogContent";
import { DialogActions } from "./DialogActions";
import { DialogHeadless } from "./DialogHeadless";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderBasicDialog(props: Partial<ComponentProps<typeof Dialog>> = {}) {
  return render(
    <Dialog open aria-label="Test dialog" {...props}>
      <DialogHeadline>Dialog headline</DialogHeadline>
      <DialogContent>Dialog body content.</DialogContent>
      <DialogActions>
        <button type="button">Cancel</button>
        <button type="button">Confirm</button>
      </DialogActions>
    </Dialog>
  );
}

function renderFullscreenDialog(props: Partial<ComponentProps<typeof Dialog>> = {}) {
  return render(
    <Dialog variant="fullscreen" open aria-label="Fullscreen dialog" {...props}>
      <DialogHeadline>Fullscreen headline</DialogHeadline>
      <DialogContent>Fullscreen body content.</DialogContent>
    </Dialog>
  );
}

/**
 * Controlled dialog wrapper for open/close interaction tests.
 */
function ControlledDialog({
  onOpenChange,
  variant,
}: {
  onOpenChange?: (open: boolean) => void;
  variant?: "basic" | "fullscreen";
}) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Dialog variant={variant} open={open} onOpenChange={handleOpenChange}>
        <DialogHeadline>Controlled dialog</DialogHeadline>
        <DialogContent>Controlled content.</DialogContent>
        <DialogActions>
          <button type="button" onClick={() => handleOpenChange(false)}>
            Cancel
          </button>
          <button type="button" onClick={() => handleOpenChange(false)}>
            Confirm
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// ─── Advance animation timers ─────────────────────────────────────────────────

function advanceToVisible(): void {
  act(() => {
    vi.advanceTimersByTime(0);
  });
}

// ─── Reduced motion mock helpers ──────────────────────────────────────────────

function mockReducedMotion(reduced: boolean): void {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)" ? reduced : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// ─── Dialog (Basic variant) ───────────────────────────────────────────────────

describe("Dialog", () => {
  // ── Rendering ───────────────────────────────────────────────────────────────

  describe("Rendering", () => {
    test("renders when open is true", () => {
      renderBasicDialog({ open: true });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("does not render when open is false", () => {
      renderBasicDialog({ open: false });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("renders headline content", () => {
      renderBasicDialog();
      expect(screen.getByText("Dialog headline")).toBeInTheDocument();
    });

    test("renders body content", () => {
      renderBasicDialog();
      expect(screen.getByText("Dialog body content.")).toBeInTheDocument();
    });

    test("renders action buttons", () => {
      renderBasicDialog();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    });

    test("defaults to basic variant", () => {
      renderBasicDialog();
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
    });

    test("renders scrim overlay when open", () => {
      renderBasicDialog({ open: true });
      expect(screen.getByTestId("dialog-scrim")).toBeInTheDocument();
    });

    test("does not render scrim when closed", () => {
      renderBasicDialog({ open: false });
      expect(screen.queryByTestId("dialog-scrim")).not.toBeInTheDocument();
    });
  });

  // ── ARIA / Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    test("has role dialog", () => {
      renderBasicDialog();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("has aria-modal true", () => {
      renderBasicDialog();
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });

    test("aria-labelledby points to headline id", () => {
      renderBasicDialog();
      const dialog = screen.getByRole("dialog");
      const labelledById = dialog.getAttribute("aria-labelledby");
      expect(labelledById).toBeTruthy();
      const headline = document.getElementById(labelledById!);
      expect(headline).toBeInTheDocument();
      expect(headline?.textContent).toBe("Dialog headline");
    });

    test("aria-describedby points to content id", () => {
      renderBasicDialog();
      const dialog = screen.getByRole("dialog");
      const describedById = dialog.getAttribute("aria-describedby");
      expect(describedById).toBeTruthy();
      const content = document.getElementById(describedById!);
      expect(content).toBeInTheDocument();
      expect(content?.textContent).toBe("Dialog body content.");
    });

    test("passes axe accessibility audit (basic)", async () => {
      const { container } = renderBasicDialog();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("passes axe accessibility audit (fullscreen)", async () => {
      const { container } = renderFullscreenDialog();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("headline renders as h2", () => {
      renderBasicDialog();
      const headline = screen.getByRole("heading", { level: 2 });
      expect(headline).toBeInTheDocument();
      expect(headline.textContent).toBe("Dialog headline");
    });
  });

  // ── Open/Close behavior ──────────────────────────────────────────────────────

  describe("Open/Close behavior", () => {
    test("controlled: renders when open prop is true", () => {
      render(
        <Dialog open onOpenChange={vi.fn()}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("controlled: hides when open prop becomes false after exit animation fallback", () => {
      vi.useFakeTimers();
      const { rerender } = render(
        <Dialog open onOpenChange={vi.fn()}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );
      // Advance to visible state
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      rerender(
        <Dialog open={false} onOpenChange={vi.fn()}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );
      // Advance past the 250ms exit animation fallback timer
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      vi.useRealTimers();
    });

    test("uncontrolled: shows dialog when defaultOpen is true", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("onOpenChange is called with false when dialog is dismissed", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(<ControlledDialog onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole("button", { name: "Open dialog" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // ── Keyboard interactions ────────────────────────────────────────────────────

  describe("Keyboard interactions", () => {
    test("Escape key closes the basic dialog", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog open onOpenChange={onOpenChange}>
          <DialogContent>Content</DialogContent>
          <DialogActions>
            <button type="button">Cancel</button>
          </DialogActions>
        </Dialog>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("Escape key closes the fullscreen dialog", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog variant="fullscreen" open onOpenChange={onOpenChange}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // ── Scrim behavior ───────────────────────────────────────────────────────────

  describe("Scrim behavior", () => {
    test("clicking scrim closes basic dialog", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog open onOpenChange={onOpenChange}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      const scrim = screen.getByTestId("dialog-scrim");
      await user.click(scrim);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("clicking scrim does NOT close fullscreen dialog", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog variant="fullscreen" open onOpenChange={onOpenChange}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      const scrim = screen.getByTestId("dialog-scrim");
      await user.click(scrim);
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    test("scrim receives animate-md-fade-in class in visible state", () => {
      vi.useFakeTimers();
      renderBasicDialog({ open: true });
      advanceToVisible();

      const scrim = screen.getByTestId("dialog-scrim");
      expect(scrim.className).toContain("animate-md-fade-in");

      vi.useRealTimers();
    });
  });

  // ── Focus management ─────────────────────────────────────────────────────────

  describe("Focus management", () => {
    test("focus moves into dialog when opened", async () => {
      const user = userEvent.setup();

      render(<ControlledDialog />);

      await user.click(screen.getByRole("button", { name: "Open dialog" }));

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog.contains(document.activeElement)).toBe(true);
      });
    });

    test("focus is trapped within dialog (Tab stays inside)", async () => {
      const user = userEvent.setup();

      render(
        <Dialog open onOpenChange={vi.fn()}>
          <DialogContent>Content</DialogContent>
          <DialogActions>
            <button type="button">First</button>
            <button type="button">Second</button>
          </DialogActions>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");
      const buttons = screen.getAllByRole("button");

      // Tab through all buttons — focus should stay within dialog
      for (const _btn of buttons) {
        await user.tab();
        expect(dialog.contains(document.activeElement)).toBe(true);
      }
    });
  });

  // ── Action button callbacks ──────────────────────────────────────────────────

  describe("Action button callbacks", () => {
    test("action button press fires callback", async () => {
      const handleConfirm = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog open onOpenChange={vi.fn()}>
          <DialogContent>Content</DialogContent>
          <DialogActions>
            <button type="button" onClick={handleConfirm}>
              Confirm
            </button>
          </DialogActions>
        </Dialog>
      );

      await user.click(screen.getByRole("button", { name: "Confirm" }));
      expect(handleConfirm).toHaveBeenCalledOnce();
    });
  });

  // ── Variant rendering ────────────────────────────────────────────────────────

  describe("Variant rendering", () => {
    test("basic variant renders dialog with correct data-variant", () => {
      renderBasicDialog();
      const dialog = screen.getByRole("dialog");
      expect(dialog.closest("[data-variant='basic']")).toBeInTheDocument();
    });

    test("fullscreen variant renders dialog with correct data-variant", () => {
      renderFullscreenDialog();
      const dialog = screen.getByRole("dialog");
      expect(dialog.closest("[data-variant='fullscreen']")).toBeInTheDocument();
    });
  });

  // ── Animation states ─────────────────────────────────────────────────────────

  describe("Animation states", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("dialog panel starts in entering state on mount", () => {
      renderBasicDialog({ open: true });
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("data-animation-state", "entering");
    });

    test("dialog panel transitions to visible after zero-delay timer", () => {
      renderBasicDialog({ open: true });
      advanceToVisible();
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("data-animation-state", "visible");
    });

    test("visible basic dialog panel has animate-md-scale-in class", () => {
      renderBasicDialog({ open: true });
      advanceToVisible();
      const dialog = screen.getByRole("dialog");
      expect(dialog.className).toContain("animate-md-scale-in");
    });

    test("visible fullscreen dialog panel has animate-md-slide-in-bottom class", () => {
      renderFullscreenDialog({ open: true });
      advanceToVisible();
      const dialog = screen.getByRole("dialog");
      expect(dialog.className).toContain("animate-md-slide-in-bottom");
    });

    test("dialog closes when onAnimationEnd fires on the panel itself (exit path)", () => {
      const { rerender } = render(
        <Dialog open onOpenChange={vi.fn()}>
          <DialogContent>Content</DialogContent>
          <DialogActions>
            <button type="button">OK</button>
          </DialogActions>
        </Dialog>
      );
      advanceToVisible();

      rerender(
        <Dialog open={false} onOpenChange={vi.fn()}>
          <DialogContent>Content</DialogContent>
          <DialogActions>
            <button type="button">OK</button>
          </DialogActions>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");
      // Fire animationend on the panel itself — target === currentTarget, handler fires
      act(() => {
        fireEvent.animationEnd(dialog);
      });

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("child animationend events do NOT advance exit state (bubbled event)", () => {
      const { rerender } = render(
        <Dialog open onOpenChange={vi.fn()}>
          <DialogContent>Content</DialogContent>
          <DialogActions>
            <button type="button">OK</button>
          </DialogActions>
        </Dialog>
      );
      advanceToVisible();

      rerender(
        <Dialog open={false} onOpenChange={vi.fn()}>
          <DialogContent>Content</DialogContent>
          <DialogActions>
            <button type="button">OK</button>
          </DialogActions>
        </Dialog>
      );

      // Fire animationend on the child button — it bubbles up to dialog.
      // e.target = button, e.currentTarget = dialog → guard returns early, no state advance.
      const button = screen.getByRole("button", { name: "OK" });
      act(() => {
        fireEvent.animationEnd(button);
      });

      // Dialog should still be in the DOM (exiting, not exited)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  // ── Hero icon ────────────────────────────────────────────────────────────────

  describe("Hero icon", () => {
    const TestIcon = () => <svg data-testid="hero-icon" aria-hidden="true" />;

    test("renders icon when icon prop is provided", () => {
      render(
        <Dialog open icon={<TestIcon />}>
          <DialogHeadline>With icon</DialogHeadline>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("hero-icon")).toBeInTheDocument();
    });

    test("sets data-with-icon on dialog panel when icon is provided", () => {
      render(
        <Dialog open icon={<TestIcon />}>
          <DialogHeadline>With icon</DialogHeadline>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("data-with-icon");
    });

    test("does NOT set data-with-icon when no icon is provided", () => {
      renderBasicDialog();
      const dialog = screen.getByRole("dialog");
      expect(dialog).not.toHaveAttribute("data-with-icon");
    });

    test("does NOT render icon in fullscreen variant", () => {
      render(
        <Dialog variant="fullscreen" open icon={<TestIcon />}>
          <DialogHeadline>Fullscreen</DialogHeadline>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );
      expect(screen.queryByTestId("hero-icon")).not.toBeInTheDocument();
    });

    test("passes axe accessibility audit with icon", async () => {
      const { container } = render(
        <Dialog open aria-label="Dialog with icon" icon={<TestIcon />}>
          <DialogHeadline>Save bookmark?</DialogHeadline>
          <DialogContent>The page will be saved.</DialogContent>
          <DialogActions>
            <button type="button">Cancel</button>
            <button type="button">Save</button>
          </DialogActions>
        </Dialog>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ── Reduced motion ───────────────────────────────────────────────────────────

  describe("Reduced motion", () => {
    beforeEach(() => {
      mockReducedMotion(true);
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("dialog panel does not have animate-md-scale-in when reduced motion is on", () => {
      renderBasicDialog({ open: true });
      advanceToVisible();
      const dialog = screen.getByRole("dialog");
      expect(dialog.className).not.toContain("animate-md-scale-in");
    });

    test("dialog panel has transition-none when reduced motion is on", () => {
      renderBasicDialog({ open: true });
      const dialog = screen.getByRole("dialog");
      expect(dialog.className).toContain("transition-none");
    });

    test("scrim does not have animate-md-fade-in when reduced motion is on", () => {
      renderBasicDialog({ open: true });
      advanceToVisible();
      const scrim = screen.getByTestId("dialog-scrim");
      expect(scrim.className).not.toContain("animate-md-fade-in");
    });

    test("dialog still renders and is accessible with reduced motion", () => {
      renderBasicDialog({ open: true });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  // ── Custom className ─────────────────────────────────────────────────────────

  describe("Custom className", () => {
    test("className is merged onto dialog panel", () => {
      renderBasicDialog({ className: "custom-test-class" });
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("custom-test-class");
    });
  });
});

// ─── DialogHeadless (Layer 2) ─────────────────────────────────────────────────

describe("DialogHeadless", () => {
  test("renders children when open", () => {
    render(
      <DialogHeadless open aria-label="Headless dialog">
        <div>Headless content</div>
      </DialogHeadless>
    );
    expect(screen.getByText("Headless content")).toBeInTheDocument();
  });

  test("does not render when closed", () => {
    render(
      <DialogHeadless open={false} aria-label="Headless dialog">
        <div>Headless content</div>
      </DialogHeadless>
    );
    expect(screen.queryByText("Headless content")).not.toBeInTheDocument();
  });

  test("has role dialog with aria-modal", () => {
    render(
      <DialogHeadless open aria-label="Headless dialog">
        <div>Content</div>
      </DialogHeadless>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });
});

// ─── Sub-components standalone ────────────────────────────────────────────────

describe("DialogHeadline", () => {
  test("renders headline text", () => {
    render(
      <Dialog open>
        <DialogHeadline>My Headline</DialogHeadline>
      </Dialog>
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("My Headline");
  });

  test("headline has a stable id attribute", () => {
    render(
      <Dialog open>
        <DialogHeadline>Headline</DialogHeadline>
      </Dialog>
    );
    const headline = screen.getByRole("heading", { level: 2 });
    expect(headline.id).toBeTruthy();
  });
});

describe("DialogContent", () => {
  test("renders content text", () => {
    render(
      <Dialog open>
        <DialogContent>My content text</DialogContent>
      </Dialog>
    );
    expect(screen.getByText("My content text")).toBeInTheDocument();
  });

  test("content has a stable id attribute", () => {
    render(
      <Dialog open>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const content = screen.getByText("Content");
    expect(content.id).toBeTruthy();
  });

  test("does not have scroll-divider attributes when content fits without scrolling", () => {
    render(
      <Dialog open>
        <DialogContent>Short content</DialogContent>
      </Dialog>
    );
    const content = document.getElementById(screen.getByText("Short content").id);
    // In JSDOM, scrollHeight === clientHeight for non-overflowing content
    expect(content).not.toHaveAttribute("data-scroll-divider-top");
    expect(content).not.toHaveAttribute("data-scroll-divider-bottom");
  });
});

describe("DialogActions", () => {
  test("renders action children", () => {
    render(
      <Dialog open>
        <DialogActions>
          <button type="button">Action</button>
        </DialogActions>
      </Dialog>
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});
