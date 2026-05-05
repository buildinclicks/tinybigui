import { useState, type ComponentProps } from "react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
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

    test("controlled: hides when open prop becomes false after exit animation", () => {
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
      // Advance past exit animation fallback (150ms)
      act(() => {
        vi.advanceTimersByTime(200);
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
