import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialsList } from "./TestimonialsList";

describe("TestimonialsList", () => {
  it("renders every testimonial's quote and author", () => {
    render(<TestimonialsList />);
    expect(screen.getByText(/found our gulshan apartment/i)).toBeInTheDocument();
    expect(screen.getByText("Rafiq Ahmed")).toBeInTheDocument();
  });
});
