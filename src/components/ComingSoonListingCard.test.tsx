import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComingSoonListingCard } from "./ComingSoonListingCard";

describe("ComingSoonListingCard", () => {
  it("renders the given photo and the Coming Soon label", () => {
    render(<ComingSoonListingCard photoSrc="/images/connect-builders/connect-builders.jpeg" />);

    expect(
      screen.getByRole("img", { name: /property under construction/i })
    ).toHaveAttribute("src", "/images/connect-builders/connect-builders.jpeg");
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it("renders a placeholder with no photo given", () => {
    render(<ComingSoonListingCard />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });
});
