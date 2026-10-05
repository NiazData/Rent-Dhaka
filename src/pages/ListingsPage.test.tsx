import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ListingsPage from "./ListingsPage";
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

describe("ListingsPage", () => {
  it("renders only listings matching the filters in the URL", async () => {
    render(
      <MemoryRouter initialEntries={["/listings?minRentBDT=1000000"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /^listings$/i })).toBeInTheDocument();
    expect(await screen.findAllByRole("link", { name: /view details/i })).toHaveLength(2);
  });

  it("shows an empty state when no listing matches the filters", async () => {
    render(
      <MemoryRouter initialEntries={["/listings?minRentBDT=999999999"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/no listings match your filters/i)).toBeInTheDocument();
  });

  it("narrows the results when a filter is changed through the sidebar", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/listings"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    await screen.findAllByRole("link", { name: /view details/i });
    await user.type(screen.getByLabelText(/^area$/i), "Rampura");

    expect(
      await screen.findByText("Ready 3-Bedroom Apartment by City Builders in Rampura")
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(1);
  });

  it("shows a purpose-specific heading and only matching listings when listingPurpose is set", async () => {
    render(
      <MemoryRouter initialEntries={["/listings?listingPurpose=sale"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /properties for sale/i })).toBeInTheDocument();
    expect(await screen.findAllByRole("link", { name: /view details/i })).toHaveLength(1);
  });

  it("shows the 3 real rent listings with a no-photo placeholder for listingPurpose=rent", async () => {
    render(
      <MemoryRouter initialEntries={["/listings?listingPurpose=rent"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /properties for rent/i })).toBeInTheDocument();
    expect(await screen.findByText(/flat a/i)).toBeInTheDocument();
    expect(screen.getByText(/flat b/i)).toBeInTheDocument();
    expect(screen.getByText(/flat c/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(3);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows a Coming Soon card with the Connect Builders photo for listingPurpose=builder", () => {
    render(
      <MemoryRouter initialEntries={["/listings?listingPurpose=builder"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /ready-built properties by builders/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /property under construction/i })).toHaveAttribute(
      "src",
      "/images/connect-builders/connect-builders.jpeg"
    );
  });

  it("toggles to map view and renders a marker per listing", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/listings?listingPurpose=sale"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    await screen.findAllByRole("link", { name: /view details/i });
    await user.click(screen.getByRole("button", { name: /^map$/i }));

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getAllByTestId("marker")).toHaveLength(1);
  });
});
