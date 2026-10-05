import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { FeaturedListings } from "./FeaturedListings";
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

describe("FeaturedListings", () => {
  it("renders a heading and three featured listing cards", async () => {
    render(
      <MemoryRouter>
        <FeaturedListings />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /featured listings/i })).toBeInTheDocument();
    expect(await screen.findAllByRole("link", { name: /view details/i })).toHaveLength(3);
  });
});
