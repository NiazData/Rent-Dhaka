import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ListingFilterSidebar } from "./ListingFilterSidebar";

describe("ListingFilterSidebar", () => {
  it("reports an updated max rent filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ListingFilterSidebar filters={{}} onChange={onChange} />);

    await user.type(screen.getByLabelText(/max rent/i), "60000");
    expect(onChange).toHaveBeenLastCalledWith({ maxRentBDT: 60000 });
  });

  it("reports an updated area filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ListingFilterSidebar filters={{}} onChange={onChange} />);

    await user.type(screen.getByLabelText(/^area$/i), "Banani");
    expect(onChange).toHaveBeenLastCalledWith({ area: "Banani" });
  });

  it("reports an updated property type filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ListingFilterSidebar filters={{}} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText(/property type/i), "condo");
    expect(onChange).toHaveBeenLastCalledWith({ propertyType: "condo" });
  });

  it("reports an updated pets-allowed filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ListingFilterSidebar filters={{}} onChange={onChange} />);

    await user.click(screen.getByLabelText(/pets allowed/i));
    expect(onChange).toHaveBeenLastCalledWith({ petsAllowed: true });
  });

  it("removes a filter key when its value is cleared", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ListingFilterSidebar filters={{ area: "Banani" }} onChange={onChange} />);

    await user.clear(screen.getByLabelText(/^area$/i));
    expect(onChange).toHaveBeenLastCalledWith({});
  });
});
