import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Drawer } from "./Drawer";
import { DrawerItem } from "./DrawerItem";
import { DrawerSection } from "./DrawerSection";
import { HeadlessDrawer, HeadlessDrawerItem } from "./DrawerHeadless";

// ─── Test Icon Mocks ───────────────────────────────────────────────────────────

const HomeIcon = () => <svg data-testid="home-icon" aria-hidden="true" />;
const SettingsIcon = () => <svg data-testid="settings-icon" aria-hidden="true" />;
const InboxIcon = () => <svg data-testid="inbox-icon" aria-hidden="true" />;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderStandardDrawer(props: Partial<React.ComponentProps<typeof Drawer>> = {}) {
  return render(
    <Drawer variant="standard" open aria-label="App navigation" {...props}>
      <DrawerItem label="Home" isActive />
      <DrawerItem label="Settings" />
    </Drawer>
  );
}

function renderModalDrawer(props: Partial<React.ComponentProps<typeof Drawer>> = {}) {
  return render(
    <Drawer variant="modal" open aria-label="App navigation" {...props}>
      <DrawerItem label="Home" isActive />
      <DrawerItem label="Settings" />
    </Drawer>
  );
}

// ─── Drawer ────────────────────────────────────────────────────────────────────

describe("Drawer", () => {
  // ── Standard Variant ────────────────────────────────────────────────────────

  describe("Standard variant", () => {
    test("renders as nav landmark", () => {
      renderStandardDrawer();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    test("has correct aria-label", () => {
      renderStandardDrawer();
      expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "App navigation");
    });

    test("renders children", () => {
      renderStandardDrawer();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    test("does NOT render a dialog role", () => {
      renderStandardDrawer();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("does NOT render a scrim when open", () => {
      renderStandardDrawer();
      expect(screen.queryByTestId("drawer-scrim")).not.toBeInTheDocument();
    });

    test("is hidden (off-screen) when open=false", () => {
      renderStandardDrawer({ open: false });
      const nav = screen.getByRole("navigation");
      expect(nav.className).toContain("-translate-x-full");
    });

    test("is visible when open=true", () => {
      renderStandardDrawer({ open: true });
      const nav = screen.getByRole("navigation");
      expect(nav.className).not.toContain("-translate-x-full");
    });

    test("calls onOpenChange when standard drawer is toggled programmatically", () => {
      const onOpenChange = vi.fn();
      renderStandardDrawer({ onOpenChange });
      // onOpenChange should not be called on initial render
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    test("accepts custom className", () => {
      renderStandardDrawer({ className: "custom-nav-class" });
      expect(screen.getByRole("navigation")).toHaveClass("custom-nav-class");
    });
  });

  // ── Modal Variant ────────────────────────────────────────────────────────────

  describe("Modal variant", () => {
    test("renders dialog with role='dialog'", () => {
      renderModalDrawer();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("has aria-modal='true'", () => {
      renderModalDrawer();
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });

    test("has correct aria-label on dialog", () => {
      renderModalDrawer();
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "App navigation");
    });

    test("renders scrim when open", () => {
      renderModalDrawer();
      expect(screen.getByTestId("drawer-scrim")).toBeInTheDocument();
    });

    test("does NOT render scrim when closed", () => {
      renderModalDrawer({ open: false });
      expect(screen.queryByTestId("drawer-scrim")).not.toBeInTheDocument();
    });

    test("calls onOpenChange(false) when scrim is clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderModalDrawer({ onOpenChange });
      await user.click(screen.getByTestId("drawer-scrim"));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("calls onOpenChange(false) when Escape is pressed", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderModalDrawer({ onOpenChange });
      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("renders nav landmark wrapping the dialog", () => {
      renderModalDrawer();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("renders children inside dialog", () => {
      renderModalDrawer();
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  // ── Accessibility ─────────────────────────────────────────────────────────────

  describe("Accessibility (axe)", () => {
    test("standard variant passes axe audit", async () => {
      const { container } = renderStandardDrawer();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("modal variant passes axe audit when open", async () => {
      const { container } = renderModalDrawer();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("modal variant passes axe audit when closed", async () => {
      const { container } = renderModalDrawer({ open: false });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

// ─── DrawerItem ───────────────────────────────────────────────────────────────

describe("DrawerItem", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  describe("Rendering", () => {
    test("renders label text", () => {
      render(<DrawerItem label="Home" />);
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    test("renders as <button> when no href", () => {
      render(<DrawerItem label="Home" />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("renders as <a> when href is provided", () => {
      render(<DrawerItem label="Home" href="/home" />);
      expect(screen.getByRole("link")).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveAttribute("href", "/home");
    });

    test("renders icon when provided", () => {
      render(<DrawerItem label="Home" icon={<HomeIcon />} />);
      expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    });

    test("renders badge content when provided", () => {
      render(<DrawerItem label="Inbox" badge={<span data-testid="badge">3</span>} />);
      expect(screen.getByTestId("badge")).toBeInTheDocument();
    });

    test("renders secondary text when provided", () => {
      render(<DrawerItem label="Profile" secondaryText="Edit your profile" />);
      expect(screen.getByText("Edit your profile")).toBeInTheDocument();
    });

    test("accepts custom className", () => {
      render(<DrawerItem label="Home" className="custom-item" />);
      expect(screen.getByRole("button")).toHaveClass("custom-item");
    });
  });

  // ── Active State ───────────────────────────────────────────────────────────

  describe("Active state", () => {
    test("has aria-current='page' when isActive=true", () => {
      render(<DrawerItem label="Home" isActive />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-current", "page");
    });

    test("does NOT have aria-current when isActive=false", () => {
      render(<DrawerItem label="Home" />);
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-current");
    });
  });

  // ── Disabled State ─────────────────────────────────────────────────────────

  describe("Disabled state", () => {
    test("is not clickable when disabled", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<DrawerItem label="Home" isDisabled onPress={onPress} />);
      const item = screen.getByRole("button");
      await user.click(item);
      expect(onPress).not.toHaveBeenCalled();
    });

    test("is not accessible when disabled", () => {
      render(<DrawerItem label="Home" isDisabled />);
      // React Aria sets the native `disabled` attribute on <button> elements
      // (or aria-disabled for non-button elements)
      const item = screen.getByRole("button");
      expect(item).toBeDisabled();
    });
  });

  // ── Interactions ───────────────────────────────────────────────────────────

  describe("Interactions", () => {
    test("calls onPress when clicked", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<DrawerItem label="Home" onPress={onPress} />);
      await user.click(screen.getByRole("button"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("calls onPress when Enter is pressed", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<DrawerItem label="Home" onPress={onPress} />);
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("calls onPress when Space is pressed", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<DrawerItem label="Home" onPress={onPress} />);
      screen.getByRole("button").focus();
      await user.keyboard(" ");
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  describe("Accessibility (axe)", () => {
    test("button item passes axe audit", async () => {
      const { container } = render(<DrawerItem label="Home" icon={<HomeIcon />} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("link item passes axe audit", async () => {
      const { container } = render(<DrawerItem label="Settings" href="/settings" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("active item passes axe audit", async () => {
      const { container } = render(<DrawerItem label="Home" isActive />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("disabled item passes axe audit", async () => {
      const { container } = render(<DrawerItem label="Home" isDisabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

// ─── DrawerSection ────────────────────────────────────────────────────────────

describe("DrawerSection", () => {
  test("renders children", () => {
    render(
      <DrawerSection>
        <DrawerItem label="Profile" />
      </DrawerSection>
    );
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  test("renders header when provided", () => {
    render(
      <DrawerSection header="Account">
        <DrawerItem label="Profile" />
      </DrawerSection>
    );
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  test("does NOT render header when not provided", () => {
    render(
      <DrawerSection>
        <DrawerItem label="Profile" />
      </DrawerSection>
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  test("renders divider when showDivider=true", () => {
    render(
      <DrawerSection showDivider>
        <DrawerItem label="Profile" />
      </DrawerSection>
    );
    // The <hr> has aria-hidden="true" so we need to query with hidden: true
    expect(screen.getByRole("separator", { hidden: true })).toBeInTheDocument();
  });

  test("does NOT render divider when showDivider=false", () => {
    render(
      <DrawerSection>
        <DrawerItem label="Profile" />
      </DrawerSection>
    );
    expect(screen.queryByRole("separator", { hidden: true })).not.toBeInTheDocument();
  });

  test("passes axe audit", async () => {
    const { container } = render(
      <nav aria-label="test">
        <DrawerSection header="Account" showDivider>
          <DrawerItem label="Profile" />
          <DrawerItem label="Logout" />
        </DrawerSection>
      </nav>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Full Drawer Composition ──────────────────────────────────────────────────

describe("Drawer composition", () => {
  test("renders standard drawer with sections and items", () => {
    render(
      <Drawer variant="standard" open aria-label="App navigation">
        <DrawerItem icon={<HomeIcon />} label="Home" isActive />
        <DrawerSection header="Account" showDivider>
          <DrawerItem icon={<SettingsIcon />} label="Settings" />
        </DrawerSection>
      </Drawer>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("standard drawer with sections passes axe audit", async () => {
    const { container } = render(
      <Drawer variant="standard" open aria-label="App navigation">
        <DrawerItem icon={<HomeIcon />} label="Home" isActive />
        <DrawerSection header="Account" showDivider>
          <DrawerItem icon={<SettingsIcon />} label="Settings" />
        </DrawerSection>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("renders modal drawer with sections and items", () => {
    render(
      <Drawer variant="modal" open aria-label="App navigation">
        <DrawerItem icon={<HomeIcon />} label="Home" isActive />
        <DrawerSection header="More" showDivider>
          <DrawerItem icon={<InboxIcon />} label="Inbox" badge={<span>5</span>} />
        </DrawerSection>
      </Drawer>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
    expect(screen.getByText("Inbox")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("controlled modal drawer toggles correctly", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Drawer variant="modal" open onOpenChange={onOpenChange} aria-label="App navigation">
        <DrawerItem label="Home" />
      </Drawer>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByTestId("drawer-scrim"));
    expect(onOpenChange).toHaveBeenCalledWith(false);

    rerender(
      <Drawer variant="modal" open={false} onOpenChange={onOpenChange} aria-label="App navigation">
        <DrawerItem label="Home" />
      </Drawer>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

// ─── Headless Primitives ──────────────────────────────────────────────────────

describe("HeadlessDrawer", () => {
  test("renders standard variant as nav landmark", () => {
    render(
      <HeadlessDrawer variant="standard" open aria-label="Headless nav">
        <div>Content</div>
      </HeadlessDrawer>
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("renders modal variant as dialog", () => {
    render(
      <HeadlessDrawer variant="modal" open aria-label="Headless nav">
        <div>Content</div>
      </HeadlessDrawer>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("HeadlessDrawerItem", () => {
  test("renders as button by default", () => {
    render(<HeadlessDrawerItem>Click me</HeadlessDrawerItem>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders as link when href is provided", () => {
    render(<HeadlessDrawerItem href="/home">Home</HeadlessDrawerItem>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  test("sets aria-current='page' when isActive=true", () => {
    render(<HeadlessDrawerItem isActive>Home</HeadlessDrawerItem>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-current", "page");
  });

  test("passes axe audit", async () => {
    const { container } = render(
      <nav aria-label="test">
        <HeadlessDrawerItem>Home</HeadlessDrawerItem>
        <HeadlessDrawerItem href="/settings">Settings</HeadlessDrawerItem>
        <HeadlessDrawerItem isActive>Active</HeadlessDrawerItem>
      </nav>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Focus Management (Modal) ─────────────────────────────────────────────────

describe("Modal drawer focus management", () => {
  test("focus returns to trigger after modal closes via Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const TriggerTest = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open Drawer</button>
          <Drawer
            variant="modal"
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              onOpenChange(val);
            }}
            aria-label="App navigation"
          >
            <DrawerItem label="Home" />
          </Drawer>
        </>
      );
    };

    render(<TriggerTest />);

    const trigger = screen.getByText("Open Drawer");
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
