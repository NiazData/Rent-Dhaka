import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useSearchParams } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { HeroSearch } from "./HeroSearch";

function ListingsStandIn() {
  const [params] = useSearchParams();
  return (
    <div>
      <p>Listings Page</p>
      <p data-testid="params">{params.toString()}</p>
    </div>
  );
}

describe("HeroSearch", () => {
  it("navigates to /listings with the chosen filters as query params", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HeroSearch />} />
          <Route path="/listings" element={<ListingsStandIn />} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/area/i), "Gulshan 2");
    await user.selectOptions(screen.getByLabelText(/property type/i), "apartment");
    await user.type(screen.getByLabelText(/max rent/i), "60000");
    await user.click(screen.getByRole("button", { name: /find a property/i }));

    expect(await screen.findByText("Listings Page")).toBeInTheDocument();
    expect(screen.getByTestId("params").textContent).toBe(
      "area=Gulshan+2&propertyType=apartment&maxRentBDT=60000"
    );
  });
});
