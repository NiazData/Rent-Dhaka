import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("renders the heading, the about picture, the address, and testimonials", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: /about this company/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /rent dhaka/i })).toHaveAttribute(
      "src",
      "/images/about/about.jpeg"
    );
    expect(screen.getByText(/mohammadpur/i)).toBeInTheDocument();
    expect(screen.getByText(/dhaka-1207/i)).toBeInTheDocument();
    expect(screen.getByText(/bangladesh/i)).toBeInTheDocument();
    expect(screen.queryByText("Shamim Hassan")).not.toBeInTheDocument();
    expect(screen.getByText(/found our gulshan apartment/i)).toBeInTheDocument();
  });
});
