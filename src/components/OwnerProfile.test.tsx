import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OwnerProfile } from "./OwnerProfile";

vi.mock("../lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  OWNER_PHOTO_PATH: "owner/photo.jpg",
  supabase: {
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://fake.test/owner/photo.jpg" } })),
      })),
    },
  },
}));

describe("OwnerProfile", () => {
  it("renders the owner's name, title, address, and contact links", () => {
    render(<OwnerProfile />);

    expect(screen.getByText("Shamim Hassan")).toBeInTheDocument();
    expect(screen.getByText("Owner, Rent Dhaka")).toBeInTheDocument();
    expect(screen.getByText(/mohammadpur/i)).toBeInTheDocument();
    expect(screen.getByText(/dhaka-1207/i)).toBeInTheDocument();
    expect(screen.getByText(/bangladesh/i)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /\+88 01970249432/ })).toHaveAttribute(
      "href",
      "tel:+8801970249432"
    );
    expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute(
      "href",
      "https://wa.me/15305913113"
    );
    expect(screen.getByRole("link", { name: /shamim2005@gmail\.com/i })).toHaveAttribute(
      "href",
      "mailto:Shamim2005@gmail.com"
    );
  });

  it("shows the admin-uploaded photo by default", () => {
    render(<OwnerProfile />);

    const photo = screen.getByRole("img", { name: "Shamim Hassan" });
    expect(photo).toHaveAttribute("src", "https://fake.test/owner/photo.jpg");
    expect(screen.queryByText(/photo coming soon/i)).not.toBeInTheDocument();
  });

  it("falls back to a placeholder when no photo has been uploaded yet", () => {
    render(<OwnerProfile />);

    fireEvent.error(screen.getByRole("img", { name: "Shamim Hassan" }));

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(/photo coming soon — uploaded by admin/i)).toBeInTheDocument();
  });
});
