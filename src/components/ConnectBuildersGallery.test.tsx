import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConnectBuildersGallery } from "./ConnectBuildersGallery";
import { supabase } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  CONNECT_BUILDERS_PREFIX: "connect-builders",
  supabase: {
    storage: {
      from: vi.fn(() => ({
        list: vi.fn(),
        getPublicUrl: vi.fn((path: string) => ({ data: { publicUrl: `https://fake.test/${path}` } })),
      })),
    },
  },
}));

describe("ConnectBuildersGallery", () => {
  it("renders nothing when the gallery is empty", async () => {
    vi.mocked(supabase.storage.from).mockReturnValue({
      list: vi.fn().mockResolvedValue({ data: [] }),
      getPublicUrl: vi.fn(),
    } as never);

    const { container } = render(<ConnectBuildersGallery />);

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it("renders an image per file in the gallery", async () => {
    vi.mocked(supabase.storage.from).mockReturnValue({
      list: vi.fn().mockResolvedValue({ data: [{ name: "photo1.jpg" }, { name: "photo2.jpg" }] }),
      getPublicUrl: vi.fn((path: string) => ({ data: { publicUrl: `https://fake.test/${path}` } })),
    } as never);

    render(<ConnectBuildersGallery />);

    const images = await screen.findAllByAltText("Builder property");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "https://fake.test/connect-builders/photo1.jpg");
  });
});
