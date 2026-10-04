import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AboutPage from "./AboutPage";

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

describe("AboutPage", () => {
  it("renders the about heading, owner profile, and testimonials", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { name: /about rent dhaka/i })).toBeInTheDocument();
    expect(screen.getByText("Shamim Hassan")).toBeInTheDocument();
    expect(screen.getByText(/found our gulshan apartment/i)).toBeInTheDocument();
  });
});
