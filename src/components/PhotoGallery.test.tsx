import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PhotoGallery } from "./PhotoGallery";

const photos = [
  "https://example.com/1.jpg",
  "https://example.com/2.jpg",
  "https://example.com/3.jpg",
];

describe("PhotoGallery", () => {
  it("starts on the first photo and advances with the next button", async () => {
    const user = userEvent.setup();
    render(<PhotoGallery photos={photos} alt="Sample listing" />);

    expect(screen.getByAltText(/photo 1 of 3/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /next photo/i }));
    expect(screen.getByAltText(/photo 2 of 3/i)).toBeInTheDocument();
  });

  it("supports left/right arrow keys when the gallery is focused", async () => {
    const user = userEvent.setup();
    render(<PhotoGallery photos={photos} alt="Sample listing" />);

    screen.getByRole("group", { name: /photo gallery/i }).focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByAltText(/photo 3 of 3/i)).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByAltText(/photo 2 of 3/i)).toBeInTheDocument();
  });

  it("advances on a left swipe and goes back on a right swipe", () => {
    render(<PhotoGallery photos={photos} alt="Sample listing" />);
    const gallery = screen.getByRole("group", { name: /photo gallery/i });

    fireEvent.touchStart(gallery, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(gallery, { changedTouches: [{ clientX: 50 }] });
    expect(screen.getByAltText(/photo 2 of 3/i)).toBeInTheDocument();

    fireEvent.touchStart(gallery, { touches: [{ clientX: 50 }] });
    fireEvent.touchEnd(gallery, { changedTouches: [{ clientX: 200 }] });
    expect(screen.getByAltText(/photo 1 of 3/i)).toBeInTheDocument();
  });
});
