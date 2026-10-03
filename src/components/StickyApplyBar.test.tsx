import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { StickyApplyBar } from "./StickyApplyBar";

describe("StickyApplyBar", () => {
  it("renders a focusable Apply Now link to the application page", () => {
    render(
      <MemoryRouter>
        <StickyApplyBar listingSlug="gulshan-2-modern-apartment" />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /apply now/i });
    expect(link).toHaveAttribute("href", "/apply/gulshan-2-modern-apartment");
    expect(link).not.toHaveAttribute("aria-hidden", "true");
    expect(link).not.toHaveAttribute("tabindex", "-1");
  });
});
