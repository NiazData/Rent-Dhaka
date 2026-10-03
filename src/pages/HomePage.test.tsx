import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("renders the hero heading, search form, featured listings, and trust section", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /better properties\. better management\. better living\./i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /find a property/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /featured listings/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /why renters trust rent dhaka/i })).toBeInTheDocument();
  });
});
