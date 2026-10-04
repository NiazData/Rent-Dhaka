import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("renders the about heading, team, and testimonials", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { name: /about rent dhaka/i })).toBeInTheDocument();
    expect(screen.getByText("Shahriar Kabir")).toBeInTheDocument();
    expect(screen.getByText(/found our gulshan apartment/i)).toBeInTheDocument();
  });
});
