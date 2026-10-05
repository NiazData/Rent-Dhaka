import type { ReactNode } from "react";
import { render, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HomePage from "../pages/HomePage";
import ListingsPage from "../pages/ListingsPage";
import ListingDetailPage from "../pages/ListingDetailPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import { createFakeListingsSupabase } from "./fakeSupabaseTable";
import { ALL_LISTINGS } from "./listingFixtures";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TileLayer: () => <div />,
  Marker: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("../lib/netlify-forms", () => ({
  submitTourRequest: vi.fn(),
  submitApplication: vi.fn(),
}));

const { fakeTable } = vi.hoisted(() => ({ fakeTable: { from: vi.fn() } }));

vi.mock("../lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  LISTINGS_TABLE: "listings",
  LISTING_PHOTOS_PREFIX: "listings",
  supabase: { from: (...args: unknown[]) => fakeTable.from(...args) },
}));

Object.assign(fakeTable, createFakeListingsSupabase(ALL_LISTINGS));

describe("accessibility", () => {
  it("Home page has no axe violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    await waitFor(() => expect(container.querySelector('[role="status"]')).not.toBeInTheDocument());
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Listings page has no axe violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/listings"]}>
        <ListingsPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(container.querySelector('[role="status"]')).not.toBeInTheDocument());
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Listing detail page has no axe violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/listings/bosila-garden-city-flat-a"]}>
        <Routes>
          <Route path="/listings/:slug" element={<ListingDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(container.querySelector('[role="status"]')).not.toBeInTheDocument());
    expect(await axe(container)).toHaveNoViolations();
  });

  it("About page has no axe violations", async () => {
    const { container } = render(<AboutPage />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Contact page has no axe violations", async () => {
    const { container } = render(<ContactPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
