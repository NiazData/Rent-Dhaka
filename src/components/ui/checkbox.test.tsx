import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("calls onCheckedChange with true when toggled on", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Pets allowed" checked={false} onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("checkbox", { name: /pets allowed/i }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
