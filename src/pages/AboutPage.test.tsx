import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("renders the about heading, owner profile, and testimonials", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { name: /about rent dhaka/i })).toBeInTheDocument();
    expect(screen.getByText("Shamim Hassan")).toBeInTheDocument();
    expect(screen.getByText(/found our gulshan apartment/i)).toBeInTheDocument();
  });
});
