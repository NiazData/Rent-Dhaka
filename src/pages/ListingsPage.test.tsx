import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ListingsPage from "./ListingsPage";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

vi.mock("../lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  CONNECT_BUILDERS_PREFIX: "connect-builders",
  supabase: {
    storage: {
      from: vi.fn(() => ({
        list: vi.fn().mockResolvedValue({ data: [] }),
        getPublicUrl: vi.fn((path: string) => ({ data: { publicUrl: `https://fake.test/${path}` } })),
      })),
    },
  },
}));

describe("ListingsPage", () => {
  it("renders only listings matching the filters in the URL", () => {
    render(
      <MemoryRouter initialEntries={["/listings?propertyType=condo"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /^listings$/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(2);
  });

  it("shows an empty state when no listing matches the filters", () => {
    render(
      <MemoryRouter initialEntries={["/listings?minRentBDT=999999999"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toHaveTextContent(/no listings match your filters/i);
  });

  it("narrows the results when a filter is changed through the sidebar", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/listings"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/^area$/i), "Banani");

    expect(screen.getByText("Executive 3-Bedroom Condo in Banani")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(1);
  });

  it("shows a purpose-specific heading and only matching listings when listingPurpose is set", () => {
    render(
      <MemoryRouter initialEntries={["/listings?listingPurpose=sale"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /properties for sale/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(3);
  });

  it("shows the ready-built-by-builders heading for listingPurpose=builder", async () => {
    render(
      <MemoryRouter initialEntries={["/listings?listingPurpose=builder"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /ready-built properties by builders/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(3);
  });

  it("toggles to map view and renders a marker per listing", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/listings?propertyType=condo"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /^map$/i }));

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getAllByTestId("marker")).toHaveLength(2);
  });
});
