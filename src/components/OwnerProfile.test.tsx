import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OwnerProfile } from "./OwnerProfile";

describe("OwnerProfile", () => {
  it("renders the owner's name, title, address, and contact links with no photo", () => {
    render(<OwnerProfile />);

    expect(screen.getByText("Shamim Hassan")).toBeInTheDocument();
    expect(screen.getByText("Owner, Rent Dhaka")).toBeInTheDocument();
    expect(screen.getByText(/mohammadpur/i)).toBeInTheDocument();
    expect(screen.getByText(/dhaka-1207/i)).toBeInTheDocument();
    expect(screen.getByText(/bangladesh/i)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /\+8801970249432/ })).toHaveAttribute(
      "href",
      "tel:+8801970249432"
    );
    expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute(
      "href",
      "https://wa.me/15305913113"
    );
    expect(screen.getByRole("link", { name: /shamim2005@gmail\.com/i })).toHaveAttribute(
      "href",
      "mailto:Shamim2005@gmail.com"
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
