import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import AdminLoginPage from "./AdminLoginPage";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn(),
    },
  },
}));

function renderPage() {
  render(
    <MemoryRouter initialEntries={["/admin/login"]}>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<div>Admin Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminLoginPage", () => {
  it("navigates to /admin on successful sign-in", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null } } as never);
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ error: null } as never);

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), "owner@rentdhaka.com");
    await user.type(screen.getByLabelText(/password/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Admin Dashboard")).toBeInTheDocument();
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "owner@rentdhaka.com",
      password: "correct-password",
    });
  });

  it("shows an error message and stays on the page when sign-in fails", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null } } as never);
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      error: { message: "Invalid login credentials" },
    } as never);

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), "owner@rentdhaka.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid email or password/i);
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });
});
