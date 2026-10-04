import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ScheduleTourModal } from "./ScheduleTourModal";
import { submitTourRequest } from "../lib/netlify-forms";

vi.mock("../lib/netlify-forms", () => ({
  submitTourRequest: vi.fn(),
}));

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), "Rafiq Ahmed");
  await user.type(screen.getByLabelText(/phone/i), "01711000000");
  await user.type(screen.getByLabelText(/email/i), "rafiq@example.com");
  await user.type(screen.getByLabelText(/preferred date/i), "2026-11-05");
}

describe("ScheduleTourModal", () => {
  it("shows a success message after a successful submission", async () => {
    vi.mocked(submitTourRequest).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<ScheduleTourModal listingSlug="gulshan-2-modern-apartment" open onOpenChange={() => {}} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /request tour/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/we'll contact you/i);
  });

  it("shows an error message when submission fails", async () => {
    vi.mocked(submitTourRequest).mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();
    render(<ScheduleTourModal listingSlug="gulshan-2-modern-apartment" open onOpenChange={() => {}} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /request tour/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});
