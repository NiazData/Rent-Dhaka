import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

describe("Dialog", () => {
  it("renders its content when open and calls onOpenChange(false) when closed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Schedule a Tour</DialogTitle>
          <p>Body content</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText("Schedule a Tour")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
