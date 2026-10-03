import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { FeaturedListings } from "./FeaturedListings";

describe("FeaturedListings", () => {
  it("renders a heading and three featured listing cards", () => {
    render(
      <MemoryRouter>
        <FeaturedListings />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /featured listings/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(3);
  });
});
