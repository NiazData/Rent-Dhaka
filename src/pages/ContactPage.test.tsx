import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ContactPage from "./ContactPage";
import { submitContactMessage } from "../lib/netlify-forms";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

vi.mock("../lib/netlify-forms", () => ({
  submitContactMessage: vi.fn(),
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

  it("submits the contact form and shows a success message", async () => {
    vi.mocked(submitContactMessage).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<ContactPage />);

    await user.type(screen.getByLabelText(/^name$/i), "Rafiq Ahmed");
    await user.type(screen.getByLabelText(/^email$/i), "rafiq@example.com");
    await user.type(screen.getByLabelText(/^message$/i), "Is this apartment still available?");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(submitContactMessage).toHaveBeenCalledWith({
      name: "Rafiq Ahmed",
      email: "rafiq@example.com",
      message: "Is this apartment still available?",
    });
    expect(await screen.findByRole("status")).toHaveTextContent(/thanks! your message has been sent/i);
  });

  it("shows an error message when the contact form submission fails", async () => {
    vi.mocked(submitContactMessage).mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();
    render(<ContactPage />);

    await user.type(screen.getByLabelText(/^name$/i), "Rafiq Ahmed");
    await user.type(screen.getByLabelText(/^email$/i), "rafiq@example.com");
    await user.type(screen.getByLabelText(/^message$/i), "Is this apartment still available?");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});
