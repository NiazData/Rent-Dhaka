import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppRoutes } from "./AppRoutes";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

vi.mock("./lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  OWNER_PHOTO_PATH: "owner/photo.jpg",
  CONNECT_BUILDERS_PREFIX: "connect-builders",
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn(),
    },
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://fake.test/owner/photo.jpg" } })),
        list: vi.fn().mockResolvedValue({ data: [] }),
      })),
    },
  },
}));

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  );
}

describe("AppRoutes", () => {
  it("renders the home page at /", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", {
        name: /better properties\. better management\. better living\./i,
      })
    ).toBeInTheDocument();
  });

  it("renders the listings page at /listings", () => {
    renderAt("/listings");
    expect(screen.getByRole("heading", { name: /listings/i })).toBeInTheDocument();
  });

  it("renders the listing detail page at /listings/:slug", () => {
    renderAt("/listings/gulshan-2-modern-apartment");
    expect(
      screen.getByRole("heading", { name: /modern 3-bedroom apartment in gulshan 2/i })
    ).toBeInTheDocument();
  });

  it("renders the application page at /apply/:slug", () => {
    renderAt("/apply/gulshan-2-modern-apartment");
    expect(
      screen.getByRole("heading", { name: /apply for modern 3-bedroom apartment in gulshan 2/i })
    ).toBeInTheDocument();
  });

  it("renders the property type page at /property-types/:type", () => {
    renderAt("/property-types/apartment");
    expect(
      screen.getByRole("heading", { name: /apartments for rent in dhaka/i })
    ).toBeInTheDocument();
  });

  it("renders the about page", () => {
    renderAt("/about");
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
  });

  it("renders the contact page", () => {
    renderAt("/contact");
    expect(screen.getByRole("heading", { name: /contact/i })).toBeInTheDocument();
  });

  it("renders the privacy page", () => {
    renderAt("/privacy");
    expect(screen.getByRole("heading", { name: /privacy/i })).toBeInTheDocument();
  });

  it("renders the Barakah Property Solutions coming-soon page", () => {
    renderAt("/barakah-property-solutions");
    expect(
      screen.getByRole("heading", { name: /barakah property solutions/i })
    ).toBeInTheDocument();
  });

  it("renders the BarakahAid coming-soon page", () => {
    renderAt("/barakahaid");
    expect(screen.getByRole("heading", { name: /barakahaid/i })).toBeInTheDocument();
  });

  it("renders the login coming-soon page", () => {
    renderAt("/login");
    expect(screen.getByRole("heading", { name: /login \/ sign up/i })).toBeInTheDocument();
  });

  it("renders the admin login page", () => {
    renderAt("/admin/login");
    expect(screen.getByRole("heading", { name: /admin login/i })).toBeInTheDocument();
  });

  it("redirects an unauthenticated visitor from /admin to the admin login page", async () => {
    renderAt("/admin");
    expect(await screen.findByRole("heading", { name: /admin login/i })).toBeInTheDocument();
  });

  it("renders the not found page for an unknown route", () => {
    renderAt("/nonexistent");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
  });
});
