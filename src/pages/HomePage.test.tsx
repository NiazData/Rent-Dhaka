import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HomePage from "./HomePage";
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

describe("HomePage", () => {
  it("renders the hero heading, search form, featured listings, and trust section", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /better properties\. better management\. better living\./i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /find a property/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /featured listings/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /why customers trust us/i })).toBeInTheDocument();
  });
});
