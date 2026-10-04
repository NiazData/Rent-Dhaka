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
  it("renders only the email link (no call or WhatsApp) plus the office map", () => {
    render(<ContactPage />);

    expect(screen.queryByRole("link", { name: /call/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /whatsapp/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /shamim2005@gmail\.com/i })).toHaveAttribute(
      "href",
      "mailto:Shamim2005@gmail.com"
    );
    expect(screen.getAllByText(/mohammadpur/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/dhaka-1207/i)).toBeInTheDocument();
    expect(screen.getByText(/bangladesh/i)).toBeInTheDocument();
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });
});
