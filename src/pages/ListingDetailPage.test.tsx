import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ListingDetailPage from "./ListingDetailPage";
import { createFakeListingsSupabase } from "../test/fakeSupabaseTable";
import { ALL_LISTINGS } from "../test/listingFixtures";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

const { fakeTable } = vi.hoisted(() => ({ fakeTable: { from: vi.fn() } }));

vi.mock("../lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  LISTINGS_TABLE: "listings",
  LISTING_PHOTOS_PREFIX: "listings",
  supabase: { from: (...args: unknown[]) => fakeTable.from(...args) },
}));

Object.assign(fakeTable, createFakeListingsSupabase(ALL_LISTINGS));

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
  it("renders listing details, amenities, and map for a valid slug, with no Apply/Tour buttons", async () => {
    renderAt("/listings/bosila-garden-city-flat-a");

    expect(
      await screen.findByRole("heading", { name: /flat a.*3 bedroom apartment in bosila garden city/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText("৳12,000/mo").length).toBeGreaterThan(0);
    expect(screen.getByText(/generator backup/i)).toBeInTheDocument();
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /apply now/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /schedule tour/i })).not.toBeInTheDocument();
  });

  it("shows a not-found message for an unknown slug", async () => {
    renderAt("/listings/does-not-exist");

    expect(await screen.findByRole("heading", { name: /listing not found/i })).toBeInTheDocument();
  });
});
