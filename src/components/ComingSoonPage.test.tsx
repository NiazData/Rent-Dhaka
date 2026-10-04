import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComingSoonPage } from "./ComingSoonPage";

describe("ComingSoonPage", () => {
  it("renders the given title and message with a Coming Soon label", () => {
    render(<ComingSoonPage title="Barakah Property Solutions" message="Launching soon." />);

    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /barakah property solutions/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Launching soon.")).toBeInTheDocument();
  });
});
