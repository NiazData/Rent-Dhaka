import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import AdminDashboardPage from "./AdminDashboardPage";
import { createFakeListingsSupabase } from "../../test/fakeSupabaseTable";
import { ALL_LISTINGS, FLAT_A } from "../../test/listingFixtures";

const { fakeTable, storageFromMock, storageFromFn, authMock } = vi.hoisted(() => {
  const storageFromMock = {
    getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://fake.test/listings/photo.jpg" } })),
    upload: vi.fn().mockResolvedValue({ error: null }),
    remove: vi.fn().mockResolvedValue({ error: null }),
  };
  return {
    fakeTable: { from: vi.fn() },
    storageFromMock,
    storageFromFn: vi.fn(() => storageFromMock),
    authMock: { signOut: vi.fn().mockResolvedValue({ error: null }) },
  };
});

vi.mock("../../lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  LISTINGS_TABLE: "listings",
  LISTING_PHOTOS_PREFIX: "listings",
  supabase: {
    auth: authMock,
    storage: { from: storageFromFn },
    from: (...args: unknown[]) => fakeTable.from(...args),
  },
}));

function renderDashboard() {
  Object.assign(fakeTable, createFakeListingsSupabase(ALL_LISTINGS));
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/login" element={<div>Admin Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

async function goToListingsTab(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
  await user.click(screen.getByRole("button", { name: /^listings$/i }));
}

function getModalScope() {
  const heading = screen.getByRole("heading", { name: /add listing|edit listing/i });
  return within(heading.closest("div")!.parentElement as HTMLElement);
}

describe("AdminDashboardPage", () => {
  it("shows stats and recent listings on the overview tab", async () => {
    renderDashboard();

    expect(await screen.findByText(FLAT_A.title)).toBeInTheDocument();
    expect(screen.getByText("Total Listings")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("lists every listing with purpose, price, and beds/baths on the listings tab", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await goToListingsTab(user);

    expect(screen.getByText(FLAT_A.title)).toBeInTheDocument();
    expect(screen.getAllByText(/rent/i).length).toBeGreaterThan(0);
    expect(screen.getByText("৳12,000")).toBeInTheDocument();
  });

  it("creates a new listing through the Add Listing modal", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await goToListingsTab(user);

    await user.click(screen.getByRole("button", { name: /add listing/i }));

    const modal = getModalScope();
    await user.type(modal.getByLabelText(/slug/i), "test-new-flat");
    await user.type(modal.getByLabelText(/title/i), "Test New Flat");
    await user.type(modal.getByLabelText(/address/i), "Somewhere, Dhaka");
    await user.type(modal.getByLabelText(/^area/i), "Test Area");
    await user.type(modal.getByLabelText(/rent \/ price/i), "20000");
    await user.type(modal.getByLabelText(/deposit/i), "20000");
    await user.type(modal.getByLabelText(/^beds/i), "2");
    await user.type(modal.getByLabelText(/^baths/i), "1");
    await user.type(modal.getByLabelText(/^sqft/i), "900");
    await user.type(modal.getByLabelText(/available from/i), "2026-12-01");
    await user.type(modal.getByLabelText(/latitude/i), "23.76");
    await user.type(modal.getByLabelText(/longitude/i), "90.36");

    await user.click(modal.getByRole("button", { name: /add listing/i }));

    expect(await screen.findByText("Test New Flat")).toBeInTheDocument();
  });

  it("edits an existing listing through the modal", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await goToListingsTab(user);

    await user.click(screen.getByRole("button", { name: `Edit ${FLAT_A.title}` }));

    const modal = getModalScope();
    const titleInput = modal.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Flat A Updated");
    await user.click(modal.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByText("Flat A Updated")).toBeInTheDocument();
  });

  it("uploads a photo inside the modal and includes it on save", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await goToListingsTab(user);

    await user.click(screen.getByRole("button", { name: `Edit ${FLAT_A.title}` }));
    const modal = getModalScope();

    const file = new File(["photo"], "flat-a.jpg", { type: "image/jpeg" });
    await user.upload(modal.getByLabelText(/upload photos/i), file);

    await waitFor(() => expect(storageFromMock.upload).toHaveBeenCalled());
    expect(await modal.findByRole("button", { name: /remove photo/i })).toBeInTheDocument();
  });

  it("deletes a listing after confirming", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    renderDashboard();
    await goToListingsTab(user);

    await user.click(screen.getByRole("button", { name: `Delete ${FLAT_A.title}` }));

    await waitFor(() => expect(screen.queryByText(FLAT_A.title)).not.toBeInTheDocument());
  });

  it("signs out and navigates to the admin login page on logout", async () => {
    const user = userEvent.setup();
    renderDashboard();

    await user.click(screen.getByRole("button", { name: /log out/i }));

    expect(authMock.signOut).toHaveBeenCalled();
    expect(await screen.findByText("Admin Login Page")).toBeInTheDocument();
  });
});
