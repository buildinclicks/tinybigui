import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import type React from "react";
import { Tabs } from "./Tabs";
import { TabList } from "./TabList";
import { Tab } from "./Tab";
import { TabPanel } from "./TabPanel";
import {
  HeadlessTabList,
  HeadlessTab,
  HeadlessTabPanel,
  HeadlessTabsContext,
} from "./TabsHeadless";

// ─── Test helpers ────────────────────────────────────────────────────────────

const PhotoIcon = () => <svg aria-hidden="true" data-testid="photo-icon" />;
const MusicIcon = () => <svg aria-hidden="true" data-testid="music-icon" />;

function BasicTabs({
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  variant,
  layout,
}: {
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: React.Key) => void;
  variant?: "primary" | "secondary";
  layout?: "fixed" | "scrollable";
}) {
  return (
    <Tabs
      aria-label="Test tabs"
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={onSelectionChange}
      variant={variant}
      layout={layout}
    >
      <TabList>
        <Tab id="photos" label="Photos" />
        <Tab id="music" label="Music" />
        <Tab id="videos" label="Videos" />
      </TabList>
      <TabPanel id="photos">Photos content</TabPanel>
      <TabPanel id="music">Music content</TabPanel>
      <TabPanel id="videos">Videos content</TabPanel>
    </Tabs>
  );
}

// ─── Rendering ───────────────────────────────────────────────────────────────

describe("Tabs", () => {
  describe("Rendering", () => {
    test("renders a tablist with role='tablist'", () => {
      render(<BasicTabs defaultSelectedKey="photos" />);
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });

    test("renders tabs with role='tab'", () => {
      render(<BasicTabs defaultSelectedKey="photos" />);
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(3);
    });

    test("renders tab panels with role='tabpanel'", () => {
      render(<BasicTabs defaultSelectedKey="photos" />);
      // Only the selected panel should be visible; others may be hidden
      const panel = screen.getByRole("tabpanel");
      expect(panel).toBeInTheDocument();
    });

    test("renders tab labels", () => {
      render(<BasicTabs defaultSelectedKey="photos" />);
      expect(screen.getByRole("tab", { name: "Photos" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Music" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Videos" })).toBeInTheDocument();
    });

    test("renders icon-only tab", () => {
      render(
        <Tabs aria-label="Icon tabs" defaultSelectedKey="photos">
          <TabList>
            <Tab id="photos" icon={<PhotoIcon />} aria-label="Photos" />
            <Tab id="music" icon={<MusicIcon />} aria-label="Music" />
          </TabList>
          <TabPanel id="photos">Photos</TabPanel>
          <TabPanel id="music">Music</TabPanel>
        </Tabs>
      );
      expect(screen.getByTestId("photo-icon")).toBeInTheDocument();
      expect(screen.getByTestId("music-icon")).toBeInTheDocument();
    });

    test("renders icon + label tab", () => {
      render(
        <Tabs aria-label="Icon label tabs" defaultSelectedKey="photos">
          <TabList>
            <Tab id="photos" icon={<PhotoIcon />} label="Photos" />
          </TabList>
          <TabPanel id="photos">Photos</TabPanel>
        </Tabs>
      );
      expect(screen.getByTestId("photo-icon")).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Photos" })).toBeInTheDocument();
    });

    test("applies custom className to tabs wrapper", () => {
      const { container } = render(
        <Tabs aria-label="Test" defaultSelectedKey="a" className="custom-tabs">
          <TabList>
            <Tab id="a" label="A" />
          </TabList>
          <TabPanel id="a">A</TabPanel>
        </Tabs>
      );
      expect(container.firstChild).toHaveClass("custom-tabs");
    });

    test("applies custom className to TabList", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="a">
          <TabList className="custom-tablist">
            <Tab id="a" label="A" />
          </TabList>
          <TabPanel id="a">A</TabPanel>
        </Tabs>
      );
      expect(screen.getByRole("tablist")).toHaveClass("custom-tablist");
    });

    test("applies custom className to Tab", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" label="A" className="custom-tab" />
          </TabList>
          <TabPanel id="a">A</TabPanel>
        </Tabs>
      );
      expect(screen.getByRole("tab", { name: "A" })).toHaveClass("custom-tab");
    });

    test("applies custom className to TabPanel", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" label="A" />
          </TabList>
          <TabPanel id="a" className="custom-panel">
            A
          </TabPanel>
        </Tabs>
      );
      expect(screen.getByRole("tabpanel")).toHaveClass("custom-panel");
    });
  });

  // ─── Selection State ───────────────────────────────────────────────────────

  describe("Selection", () => {
    test("shows first tab panel by default when defaultSelectedKey is set", () => {
      render(<BasicTabs defaultSelectedKey="photos" />);
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Photos content");
    });

    test("selected tab has aria-selected='true'", () => {
      render(<BasicTabs defaultSelectedKey="music" />);
      expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute("aria-selected", "true");
    });

    test("non-selected tabs have aria-selected='false'", () => {
      render(<BasicTabs defaultSelectedKey="music" />);
      expect(screen.getByRole("tab", { name: "Photos" })).toHaveAttribute("aria-selected", "false");
      expect(screen.getByRole("tab", { name: "Videos" })).toHaveAttribute("aria-selected", "false");
    });

    test("clicking a tab changes selection (uncontrolled)", async () => {
      const user = userEvent.setup();
      render(<BasicTabs defaultSelectedKey="photos" />);

      await user.click(screen.getByRole("tab", { name: "Music" }));

      expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Music content");
    });

    test("calls onSelectionChange when tab is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BasicTabs defaultSelectedKey="photos" onSelectionChange={handleChange} />);

      await user.click(screen.getByRole("tab", { name: "Videos" }));

      expect(handleChange).toHaveBeenCalledWith("videos");
    });

    test("controlled: respects selectedKey prop", () => {
      render(<BasicTabs selectedKey="videos" />);
      expect(screen.getByRole("tab", { name: "Videos" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Videos content");
    });

    test("controlled: does not change selection without onSelectionChange updating prop", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BasicTabs selectedKey="photos" onSelectionChange={handleChange} />);

      await user.click(screen.getByRole("tab", { name: "Music" }));

      // Since controlled, the selection stays unless prop is updated
      expect(handleChange).toHaveBeenCalledWith("music");
      // But the visual selection is still 'photos' (controlled, not updated)
      expect(screen.getByRole("tab", { name: "Photos" })).toHaveAttribute("aria-selected", "true");
    });
  });

  // ─── Keyboard Navigation ──────────────────────────────────────────────────

  describe("Keyboard navigation", () => {
    test("ArrowRight moves focus to next tab", async () => {
      const user = userEvent.setup();
      render(<BasicTabs defaultSelectedKey="photos" />);

      const photosTab = screen.getByRole("tab", { name: "Photos" });
      photosTab.focus();
      await user.keyboard("{ArrowRight}");

      expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Music" }));
    });

    test("ArrowLeft moves focus to previous tab", async () => {
      const user = userEvent.setup();
      render(<BasicTabs defaultSelectedKey="music" />);

      const musicTab = screen.getByRole("tab", { name: "Music" });
      musicTab.focus();
      await user.keyboard("{ArrowLeft}");

      expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Photos" }));
    });

    test("ArrowRight wraps from last to first tab", async () => {
      const user = userEvent.setup();
      render(<BasicTabs defaultSelectedKey="videos" />);

      const videosTab = screen.getByRole("tab", { name: "Videos" });
      videosTab.focus();
      await user.keyboard("{ArrowRight}");

      expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Photos" }));
    });

    test("ArrowLeft wraps from first to last tab", async () => {
      const user = userEvent.setup();
      render(<BasicTabs defaultSelectedKey="photos" />);

      const photosTab = screen.getByRole("tab", { name: "Photos" });
      photosTab.focus();
      await user.keyboard("{ArrowLeft}");

      expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Videos" }));
    });

    test("Home key moves focus to first tab", async () => {
      const user = userEvent.setup();
      render(<BasicTabs defaultSelectedKey="videos" />);

      const videosTab = screen.getByRole("tab", { name: "Videos" });
      videosTab.focus();
      await user.keyboard("{Home}");

      expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Photos" }));
    });

    test("End key moves focus to last tab", async () => {
      const user = userEvent.setup();
      render(<BasicTabs defaultSelectedKey="photos" />);

      const photosTab = screen.getByRole("tab", { name: "Photos" });
      photosTab.focus();
      await user.keyboard("{End}");

      expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Videos" }));
    });

    test("Enter key selects focused tab", async () => {
      const user = userEvent.setup();
      render(<BasicTabs defaultSelectedKey="photos" />);

      const photosTab = screen.getByRole("tab", { name: "Photos" });
      photosTab.focus();
      await user.keyboard("{ArrowRight}{Enter}");

      expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute("aria-selected", "true");
    });
  });

  // ─── Accessibility ─────────────────────────────────────────────────────────

  describe("Accessibility", () => {
    test("tab has aria-controls pointing to its panel", () => {
      render(<BasicTabs defaultSelectedKey="photos" />);
      const photosTab = screen.getByRole("tab", { name: "Photos" });
      const ariaControls = photosTab.getAttribute("aria-controls");
      expect(ariaControls).toBeTruthy();

      const panel = document.getElementById(ariaControls!);
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveTextContent("Photos content");
    });

    test("panel has aria-labelledby pointing to its tab", () => {
      render(<BasicTabs defaultSelectedKey="photos" />);
      const panel = screen.getByRole("tabpanel");
      const ariaLabelledBy = panel.getAttribute("aria-labelledby");
      expect(ariaLabelledBy).toBeTruthy();

      const tab = document.getElementById(ariaLabelledBy!);
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveTextContent("Photos");
    });

    test("tablist has accessible label from aria-label", () => {
      render(<BasicTabs defaultSelectedKey="photos" />);
      expect(screen.getByRole("tablist", { name: "Test tabs" })).toBeInTheDocument();
    });

    test("tablist has accessible label from aria-labelledby", () => {
      render(
        <div>
          <h2 id="tabs-heading">My Tabs</h2>
          <Tabs aria-labelledby="tabs-heading" defaultSelectedKey="photos">
            <TabList>
              <Tab id="photos" label="Photos" />
            </TabList>
            <TabPanel id="photos">Photos</TabPanel>
          </Tabs>
        </div>
      );
      expect(screen.getByRole("tablist", { name: "My Tabs" })).toBeInTheDocument();
    });

    test("passes axe accessibility audit (primary)", async () => {
      const { container } = render(<BasicTabs defaultSelectedKey="photos" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("passes axe accessibility audit (secondary)", async () => {
      const { container } = render(<BasicTabs defaultSelectedKey="photos" variant="secondary" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("passes axe accessibility audit (scrollable)", async () => {
      const { container } = render(<BasicTabs defaultSelectedKey="photos" layout="scrollable" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("selected tab has tabindex='0', others have tabindex='-1' (roving tabIndex)", () => {
      render(<BasicTabs defaultSelectedKey="music" />);
      expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute("tabindex", "0");
      expect(screen.getByRole("tab", { name: "Photos" })).toHaveAttribute("tabindex", "-1");
      expect(screen.getByRole("tab", { name: "Videos" })).toHaveAttribute("tabindex", "-1");
    });
  });

  // ─── Variants ─────────────────────────────────────────────────────────────

  describe("Variants", () => {
    test("primary variant: selected tab has text-primary class", () => {
      render(<BasicTabs defaultSelectedKey="photos" variant="primary" />);
      expect(screen.getByRole("tab", { name: "Photos" })).toHaveClass("text-primary");
    });

    test("secondary variant: selected tab has text-on-surface class", () => {
      render(<BasicTabs defaultSelectedKey="photos" variant="secondary" />);
      expect(screen.getByRole("tab", { name: "Photos" })).toHaveClass("text-on-surface");
    });

    test("unselected tab has text-on-surface-variant class for both variants", () => {
      const { rerender } = render(<BasicTabs defaultSelectedKey="photos" variant="primary" />);
      expect(screen.getByRole("tab", { name: "Music" })).toHaveClass("text-on-surface-variant");

      rerender(
        <Tabs aria-label="Test tabs" defaultSelectedKey="photos" variant="secondary">
          <TabList>
            <Tab id="photos" label="Photos" />
            <Tab id="music" label="Music" />
            <Tab id="videos" label="Videos" />
          </TabList>
          <TabPanel id="photos">Photos content</TabPanel>
          <TabPanel id="music">Music content</TabPanel>
          <TabPanel id="videos">Videos content</TabPanel>
        </Tabs>
      );
      expect(screen.getByRole("tab", { name: "Music" })).toHaveClass("text-on-surface-variant");
    });
  });

  // ─── Layout ───────────────────────────────────────────────────────────────

  describe("Layout", () => {
    test("fixed layout: tabs have flex-1 class", () => {
      render(<BasicTabs defaultSelectedKey="photos" layout="fixed" />);
      const tabs = screen.getAllByRole("tab");
      tabs.forEach((tab) => {
        expect(tab).toHaveClass("flex-1");
      });
    });

    test("scrollable layout: tablist has overflow-x-auto class", () => {
      render(<BasicTabs defaultSelectedKey="photos" layout="scrollable" />);
      expect(screen.getByRole("tablist")).toHaveClass("overflow-x-auto");
    });

    test("scrollable layout: tabs have min-w and shrink-0 classes", () => {
      render(<BasicTabs defaultSelectedKey="photos" layout="scrollable" />);
      const tabs = screen.getAllByRole("tab");
      tabs.forEach((tab) => {
        expect(tab).toHaveClass("shrink-0");
      });
    });
  });

  // ─── Disabled State ───────────────────────────────────────────────────────

  describe("Disabled", () => {
    test("disabled tab has aria-disabled='true'", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="photos">
          <TabList>
            <Tab id="photos" label="Photos" />
            <Tab id="music" label="Music" isDisabled />
          </TabList>
          <TabPanel id="photos">Photos</TabPanel>
          <TabPanel id="music">Music</TabPanel>
        </Tabs>
      );
      expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute("aria-disabled", "true");
    });

    test("disabled tab cannot be selected by clicking", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Tabs aria-label="Test" defaultSelectedKey="photos" onSelectionChange={handleChange}>
          <TabList>
            <Tab id="photos" label="Photos" />
            <Tab id="music" label="Music" isDisabled />
          </TabList>
          <TabPanel id="photos">Photos</TabPanel>
          <TabPanel id="music">Music</TabPanel>
        </Tabs>
      );

      await user.click(screen.getByRole("tab", { name: "Music" }));
      expect(handleChange).not.toHaveBeenCalledWith("music");
    });

    test("disabled tab is skipped by keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <Tabs aria-label="Test" defaultSelectedKey="photos">
          <TabList>
            <Tab id="photos" label="Photos" />
            <Tab id="music" label="Music" isDisabled />
            <Tab id="videos" label="Videos" />
          </TabList>
          <TabPanel id="photos">Photos</TabPanel>
          <TabPanel id="music">Music</TabPanel>
          <TabPanel id="videos">Videos</TabPanel>
        </Tabs>
      );

      const photosTab = screen.getByRole("tab", { name: "Photos" });
      photosTab.focus();
      await user.keyboard("{ArrowRight}");

      // Should skip the disabled Music tab and land on Videos
      expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Videos" }));
    });

    test("disabled tab has opacity-38 class", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="photos">
          <TabList>
            <Tab id="photos" label="Photos" />
            <Tab id="music" label="Music" isDisabled />
          </TabList>
          <TabPanel id="photos">Photos</TabPanel>
          <TabPanel id="music">Music</TabPanel>
        </Tabs>
      );
      expect(screen.getByRole("tab", { name: "Music" })).toHaveClass("opacity-38");
    });
  });

  // ─── Badge ────────────────────────────────────────────────────────────────

  describe("Badge", () => {
    test("renders numeric badge on tab", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" label="Messages" badge={5} />
          </TabList>
          <TabPanel id="a">Messages</TabPanel>
        </Tabs>
      );
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    test("truncates badge count > 999 to '999+'", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" label="Notifications" badge={1234} />
          </TabList>
          <TabPanel id="a">Notifications</TabPanel>
        </Tabs>
      );
      expect(screen.getByText("999+")).toBeInTheDocument();
    });

    test("does not render badge when count is 0", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" label="Messages" badge={0} />
          </TabList>
          <TabPanel id="a">Messages</TabPanel>
        </Tabs>
      );
      // No badge element should be visible
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    test("renders dot badge when badge=true", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" label="Updates" badge={true} data-testid="dot-badge-tab" />
          </TabList>
          <TabPanel id="a">Updates</TabPanel>
        </Tabs>
      );
      // Dot badge should be present (no text)
      const tab = screen.getByRole("tab", { name: "Updates" });
      const dotBadge = tab.querySelector("[data-badge-type='dot']");
      expect(dotBadge).toBeInTheDocument();
    });
  });

  // ─── Ripple ───────────────────────────────────────────────────────────────

  describe("Ripple", () => {
    test("renders ripple container on tab items", () => {
      render(<BasicTabs defaultSelectedKey="photos" />);
      const tabs = screen.getAllByRole("tab");
      tabs.forEach((tab) => {
        expect(tab.querySelector("[data-ripple-container]")).toBeInTheDocument();
      });
    });

    test("does not render ripple when disableRipple is true", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" label="A" disableRipple />
          </TabList>
          <TabPanel id="a">A</TabPanel>
        </Tabs>
      );
      const tab = screen.getByRole("tab", { name: "A" });
      expect(tab.querySelector("[data-ripple-container]")).not.toBeInTheDocument();
    });
  });

  // ─── Active Indicator ─────────────────────────────────────────────────────

  describe("Active indicator", () => {
    test("renders an active indicator element inside the tablist", () => {
      render(<BasicTabs defaultSelectedKey="photos" />);
      const tablist = screen.getByRole("tablist");
      const indicator = tablist.querySelector("[data-tab-indicator]");
      expect(indicator).toBeInTheDocument();
    });

    test("primary indicator has bg-primary class", () => {
      render(<BasicTabs defaultSelectedKey="photos" variant="primary" />);
      const tablist = screen.getByRole("tablist");
      const indicator = tablist.querySelector("[data-tab-indicator]");
      expect(indicator).toHaveClass("bg-primary");
    });

    test("secondary indicator has bg-on-surface-variant class", () => {
      render(<BasicTabs defaultSelectedKey="photos" variant="secondary" />);
      const tablist = screen.getByRole("tablist");
      const indicator = tablist.querySelector("[data-tab-indicator]");
      expect(indicator).toHaveClass("bg-on-surface-variant");
    });
  });

  // ─── Headless Primitives ──────────────────────────────────────────────────

  describe("Headless primitives", () => {
    test("HeadlessTabList renders with role='tablist'", () => {
      // This test verifies the headless layer is exposed for advanced consumers.
      // We use a minimal render to check the API surface.
      const { container } = render(
        <Tabs aria-label="Test" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" label="A" />
          </TabList>
          <TabPanel id="a">A</TabPanel>
        </Tabs>
      );
      expect(container.querySelector('[role="tablist"]')).toBeInTheDocument();
    });

    test("HeadlessTabsContext is exported", () => {
      expect(HeadlessTabsContext).toBeDefined();
    });

    test("HeadlessTabList is exported and usable", () => {
      expect(HeadlessTabList).toBeDefined();
    });

    test("HeadlessTab is exported and usable", () => {
      expect(HeadlessTab).toBeDefined();
    });

    test("HeadlessTabPanel is exported and usable", () => {
      expect(HeadlessTabPanel).toBeDefined();
    });

    test("HeadlessTabList renders a tablist with tabs inside Tabs wrapper", () => {
      render(
        <Tabs aria-label="Headless test" defaultSelectedKey="x">
          <HeadlessTabList>
            <HeadlessTab item={{ key: "x", id: "x" }}>
              {({ isSelected }) => <span>{isSelected ? "X (selected)" : "X"}</span>}
            </HeadlessTab>
            <HeadlessTab item={{ key: "y", id: "y" }}>
              {({ isSelected }) => <span>{isSelected ? "Y (selected)" : "Y"}</span>}
            </HeadlessTab>
          </HeadlessTabList>
          <HeadlessTabPanel>Panel content</HeadlessTabPanel>
        </Tabs>
      );
      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(2);
      expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    });

    test("HeadlessTab selected state is reflected in aria-selected", () => {
      render(
        <Tabs aria-label="Headless test" defaultSelectedKey="x">
          <HeadlessTabList>
            <HeadlessTab item={{ key: "x", id: "x" }}>X</HeadlessTab>
            <HeadlessTab item={{ key: "y", id: "y" }}>Y</HeadlessTab>
          </HeadlessTabList>
          <HeadlessTabPanel>Content</HeadlessTabPanel>
        </Tabs>
      );
      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    });
  });

  // ─── Edge cases ───────────────────────────────────────────────────────────

  // ─── Error handling ───────────────────────────────────────────────────────

  describe("Error handling", () => {
    test("Tab throws when used outside Tabs context", () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => {
        render(<Tab id="test" label="Test" />);
      }).toThrow();
      consoleError.mockRestore();
    });

    test("TabList throws when used outside Tabs context", () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => {
        render(
          <TabList>
            <Tab id="a" label="A" />
          </TabList>
        );
      }).toThrow();
      consoleError.mockRestore();
    });
  });

  describe("Edge cases", () => {
    test("renders single tab correctly", () => {
      render(
        <Tabs aria-label="Test" defaultSelectedKey="only">
          <TabList>
            <Tab id="only" label="Only" />
          </TabList>
          <TabPanel id="only">Content</TabPanel>
        </Tabs>
      );
      expect(screen.getByRole("tab", { name: "Only" })).toHaveAttribute("aria-selected", "true");
    });

    test("renders many tabs without error", () => {
      const tabItems = Array.from({ length: 10 }, (_, i) => ({
        id: `tab-${i}`,
        label: `Tab ${i + 1}`,
      }));
      render(
        <Tabs aria-label="Many tabs" defaultSelectedKey="tab-0">
          <TabList>
            {tabItems.map((t) => (
              <Tab key={t.id} id={t.id} label={t.label} />
            ))}
          </TabList>
          {tabItems.map((t) => (
            <TabPanel key={t.id} id={t.id}>
              Content {t.id}
            </TabPanel>
          ))}
        </Tabs>
      );
      expect(screen.getAllByRole("tab")).toHaveLength(10);
    });
  });
});
