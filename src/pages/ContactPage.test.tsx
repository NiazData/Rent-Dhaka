import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ContactPage from "./ContactPage";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

describe("ContactPage", () => {
  it("renders click-to-call, WhatsApp, and email links plus the office map", () => {
    render(<ContactPage />);

    expect(screen.getByRole("link", { name: /call/i })).toHaveAttribute(
      "href",
      "tel:+8801970249432"
    );
    expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute(
      "href",
      "https://wa.me/8801970249432"
    );
    expect(screen.getByRole("link", { name: /hello@rentdhaka\.com/i })).toHaveAttribute(
      "href",
      "mailto:hello@rentdhaka.com"
    );
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });
});
