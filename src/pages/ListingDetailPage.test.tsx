import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ListingDetailPage from "./ListingDetailPage";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

vi.mock("../lib/netlify-forms", () => ({
  submitTourRequest: vi.fn(),
  submitApplication: vi.fn(),
}));

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/listings/:slug" element={<ListingDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ListingDetailPage", () => {
  it("renders listing details, amenities, map, and the apply link for a valid slug", () => {
    renderAt("/listings/bosila-garden-city-flat-a");

    expect(
      screen.getByRole("heading", { name: /flat a.*3 bedroom apartment in bosila garden city/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText("৳12,000/mo").length).toBeGreaterThan(0);
    expect(screen.getByText(/generator backup/i)).toBeInTheDocument();
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /apply now/i }).length).toBeGreaterThan(0);
  });

  it("shows a not-found message for an unknown slug", () => {
    renderAt("/listings/does-not-exist");

    expect(screen.getByRole("heading", { name: /listing not found/i })).toBeInTheDocument();
  });

  it("opens the schedule tour modal from the desktop button", async () => {
    const user = userEvent.setup();
    renderAt("/listings/bosila-garden-city-flat-a");

    // [0] is the desktop action row, [1] is the mobile sticky bar (rendered after it).
    const buttons = screen.getAllByRole("button", { name: /schedule tour/i });
    expect(buttons).toHaveLength(2);
    await user.click(buttons[0]);
    expect(screen.getByText("Schedule a Tour")).toBeInTheDocument();
  });

  it("opens the schedule tour modal from the mobile sticky bar button", async () => {
    const user = userEvent.setup();
    renderAt("/listings/bosila-garden-city-flat-a");

    await user.click(screen.getAllByRole("button", { name: /schedule tour/i })[1]);
    expect(screen.getByText("Schedule a Tour")).toBeInTheDocument();
  });
});
