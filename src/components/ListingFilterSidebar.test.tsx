import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ListingFilterSidebar } from "./ListingFilterSidebar";
import type { ListingFilters } from "../types";

// ListingFilterSidebar's text/number inputs are fully controlled (`value=`), matching
// how the real ListingsPage keeps them in sync with the URL on every keystroke. A bare
// static `filters` prop in a test doesn't update between renders, so React resets the
// DOM value after each keystroke and `user.type` can't accumulate characters. This
// harness mirrors ListingsPage's real behavior by feeding each onChange back in as the
// next `filters` prop, so typing accumulates the same way it does in the live app.
function ControlledHarness({
  initialFilters = {},
  onChange,
}: {
  initialFilters?: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}) {
  const [filters, setFilters] = useState<ListingFilters>(initialFilters);
  function handleChange(next: ListingFilters) {
    setFilters(next);
    onChange(next);
  }
  return <ListingFilterSidebar filters={filters} onChange={handleChange} />;
}

describe("ListingFilterSidebar", () => {
  it("reports an updated max rent filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledHarness onChange={onChange} />);

    await user.type(screen.getByLabelText(/max rent/i), "60000");
    expect(onChange).toHaveBeenLastCalledWith({ maxRentBDT: 60000 });
  });

  it("reports an updated area filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledHarness onChange={onChange} />);

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
    render(<ControlledHarness initialFilters={{ area: "Banani" }} onChange={onChange} />);

    await user.clear(screen.getByLabelText(/^area$/i));
    expect(onChange).toHaveBeenLastCalledWith({});
  });
});
