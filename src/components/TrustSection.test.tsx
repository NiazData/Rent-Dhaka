import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrustSection } from "./TrustSection";

describe("TrustSection", () => {
  it("renders the trust heading and key stats", () => {
    render(<TrustSection />);
    expect(screen.getByRole("heading", { name: /why customers trust us/i })).toBeInTheDocument();
    expect(screen.getByText(/years serving dhaka renters/i)).toBeInTheDocument();
    expect(screen.getByText(/verified properties managed/i)).toBeInTheDocument();
  });
});
