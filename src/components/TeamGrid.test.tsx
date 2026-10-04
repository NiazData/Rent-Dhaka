import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TeamGrid } from "./TeamGrid";

describe("TeamGrid", () => {
  it("renders every team member's name and role", () => {
    render(<TeamGrid />);
    expect(screen.getByText("Shahriar Kabir")).toBeInTheDocument();
    expect(screen.getByText("Founder & Managing Director")).toBeInTheDocument();
    expect(screen.getByText("Farhana Akter")).toBeInTheDocument();
    expect(screen.getByText("Tanvir Islam")).toBeInTheDocument();
  });
});
