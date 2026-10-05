import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import PropertyTypePage from "./PropertyTypePage";
import { createFakeListingsSupabase } from "../test/fakeSupabaseTable";
import { ALL_LISTINGS } from "../test/listingFixtures";

const { fakeTable } = vi.hoisted(() => ({ fakeTable: { from: vi.fn() } }));

vi.mock("../lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  LISTINGS_TABLE: "listings",
  LISTING_PHOTOS_PREFIX: "listings",
  supabase: { from: (...args: unknown[]) => fakeTable.from(...args) },
}));

Object.assign(fakeTable, createFakeListingsSupabase(ALL_LISTINGS));

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
  it("renders the apartment type info and only apartment rent listings", async () => {
    renderAt("/property-types/apartment");

    expect(
      screen.getByRole("heading", { name: /apartments for rent in dhaka/i })
    ).toBeInTheDocument();
    expect(await screen.findAllByRole("link", { name: /view details/i })).toHaveLength(3);
  });

  it("shows no listings for a rent property type with no current matches", async () => {
    renderAt("/property-types/condo");

    expect(screen.getByRole("heading", { name: /condos for rent in dhaka/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
    expect(screen.queryByRole("link", { name: /view details/i })).not.toBeInTheDocument();
  });

  it("shows a not-found message for an unknown type", () => {
    renderAt("/property-types/mansion");

    expect(screen.getByRole("heading", { name: /property type not found/i })).toBeInTheDocument();
  });
});
