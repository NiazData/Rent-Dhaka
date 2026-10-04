import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PropertyTypePage from "./PropertyTypePage";

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/property-types/:type" element={<PropertyTypePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("PropertyTypePage", () => {
  it("renders the condo type info and only condo listings", () => {
    renderAt("/property-types/condo");

    expect(screen.getByRole("heading", { name: /condos for rent in dhaka/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(2);
  });

  it("shows a not-found message for an unknown type", () => {
    renderAt("/property-types/mansion");

    expect(screen.getByRole("heading", { name: /property type not found/i })).toBeInTheDocument();
  });
});
