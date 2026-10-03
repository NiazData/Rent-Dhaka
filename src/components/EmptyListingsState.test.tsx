import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyListingsState } from "./EmptyListingsState";

describe("EmptyListingsState", () => {
  it("renders a status message explaining there are no matches", () => {
    render(<EmptyListingsState />);
    expect(screen.getByRole("status")).toHaveTextContent(/no listings match your filters/i);
  });
});
