import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotFoundMessage } from "./NotFoundMessage";

describe("NotFoundMessage", () => {
  it("renders the given heading and message", () => {
    render(<NotFoundMessage heading="Listing not found" message="It may have been removed." />);
    expect(screen.getByRole("heading", { name: /listing not found/i })).toBeInTheDocument();
    expect(screen.getByText("It may have been removed.")).toBeInTheDocument();
  });
});
