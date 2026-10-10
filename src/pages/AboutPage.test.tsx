import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("renders the heading, the about picture, the address, and testimonials", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: /about this company/i })).toBeInTheDocument();
    expect(screen.getByText(/iman homes was founded in 2014/i)).toBeInTheDocument();
    expect(screen.getByText(/your land, our manpower, work together/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /iman homes/i })).toHaveAttribute(
      "src",
      "/images/about/about.jpeg"
    );
    expect(screen.getAllByText(/mohammadpur/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/dhaka-1207/i)).toBeInTheDocument();
    expect(screen.getAllByText(/bangladesh/i).length).toBeGreaterThan(0);
    expect(screen.queryByText("Shamim Hassan")).not.toBeInTheDocument();
    expect(screen.getByText(/found our gulshan apartment/i)).toBeInTheDocument();
  });
});
