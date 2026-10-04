import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { RequireAdmin } from "./RequireAdmin";
import { supabase } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
}));

function renderProtected() {
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <div>Admin Dashboard</div>
            </RequireAdmin>
          }
        />
        <Route path="/admin/login" element={<div>Admin Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RequireAdmin", () => {
  it("redirects to /admin/login when there is no session", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null } } as never);

    renderProtected();

    expect(await screen.findByText("Admin Login Page")).toBeInTheDocument();
  });

  it("renders the protected content when a session exists", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: "u1" } } },
    } as never);

    renderProtected();

    expect(await screen.findByText("Admin Dashboard")).toBeInTheDocument();
  });
});
