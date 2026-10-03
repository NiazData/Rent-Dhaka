import { describe, expect, it } from "vitest";
import { formatBDT } from "./format";

describe("formatBDT", () => {
  it("formats zero", () => {
    expect(formatBDT(0)).toBe("৳0");
  });

  it("formats a four-digit amount with thousands grouping", () => {
    expect(formatBDT(45000)).toBe("৳45,000");
  });

  it("formats a seven-digit amount with lakh-style grouping", () => {
    expect(formatBDT(1000000)).toBe("৳10,00,000");
  });
});
