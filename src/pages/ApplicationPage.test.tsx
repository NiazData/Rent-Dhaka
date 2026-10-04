import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ApplicationPage from "./ApplicationPage";
import { submitApplication } from "../lib/netlify-forms";

vi.mock("../lib/netlify-forms", () => ({
  submitApplication: vi.fn(),
  submitTourRequest: vi.fn(),
}));

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/apply/:slug" element={<ApplicationPage />} />
      </Routes>
    </MemoryRouter>
  );
}

async function completeAllSteps(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), "Rafiq Ahmed");
  await user.type(screen.getByLabelText(/^email$/i), "rafiq@example.com");
  await user.type(screen.getByLabelText(/^phone$/i), "01711000000");
  await user.click(screen.getByRole("button", { name: /next/i }));

  await user.type(screen.getByLabelText(/employer/i), "ACME Corp");
  await user.type(screen.getByLabelText(/position/i), "Engineer");
  await user.type(screen.getByLabelText(/monthly income/i), "80000");
  await user.click(screen.getByRole("button", { name: /next/i }));

  await user.type(screen.getByLabelText(/previous address/i), "House 1, Road 2, Dhanmondi");
  await user.click(screen.getByRole("button", { name: /next/i }));

  await user.upload(
    screen.getByLabelText(/national id/i),
    new File(["id"], "nid.png", { type: "image/png" })
  );
  await user.click(screen.getByRole("button", { name: /next/i }));
}

describe("ApplicationPage", () => {
  it("shows a not-found message for an unknown slug", () => {
    renderAt("/apply/does-not-exist");
    expect(screen.getByRole("heading", { name: /listing not found/i })).toBeInTheDocument();
  });

  it("blocks moving to the next step until the current step's required fields are valid", async () => {
    const user = userEvent.setup();
    renderAt("/apply/gulshan-2-modern-apartment");

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
    await user.type(screen.getByLabelText(/full name/i), "Rafiq Ahmed");
    await user.type(screen.getByLabelText(/^email$/i), "rafiq@example.com");
    await user.type(screen.getByLabelText(/^phone$/i), "01711000000");
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });

  it("walks through every step and submits successfully on review", async () => {
    vi.mocked(submitApplication).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderAt("/apply/gulshan-2-modern-apartment");

    await completeAllSteps(user);

    expect(screen.getByText(/nid\.png/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/application submitted/i);
  });

  it("shows an error message when submission fails", async () => {
    vi.mocked(submitApplication).mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();
    renderAt("/apply/gulshan-2-modern-apartment");

    await completeAllSteps(user);
    await user.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});
