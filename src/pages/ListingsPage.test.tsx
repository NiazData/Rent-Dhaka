import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ListingsPage from "./ListingsPage";

describe("ListingsPage", () => {
  it("renders only listings matching the filters in the URL", () => {
    render(
      <MemoryRouter initialEntries={["/listings?propertyType=condo"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /^listings$/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(2);
  });

  it("shows an empty state when no listing matches the filters", () => {
    render(
      <MemoryRouter initialEntries={["/listings?minRentBDT=999999999"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toHaveTextContent(/no listings match your filters/i);
  });

  it("narrows the results when a filter is changed through the sidebar", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/listings"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/^area$/i), "Banani");

    expect(screen.getByText("Executive 3-Bedroom Condo in Banani")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(1);
  });
});
