import { describe, expect, it } from "vitest";
import {
  getAllPropertyTypes,
  getPropertyTypeInfo,
  getTeamMembers,
  getTestimonials,
} from "./content-repository";

describe("content repository", () => {
  it("returns all testimonials", () => {
    expect(getTestimonials().length).toBeGreaterThanOrEqual(3);
  });

  it("returns all team members", () => {
    expect(getTeamMembers().length).toBeGreaterThanOrEqual(3);
  });

  it("returns all property types", () => {
    expect(getAllPropertyTypes()).toHaveLength(4);
  });

  it("returns info for a known property type", () => {
    expect(getPropertyTypeInfo("condo")?.title).toBe("Condos for Rent in Dhaka");
  });

  it("returns undefined for an unknown property type", () => {
    expect(getPropertyTypeInfo("mansion")).toBeUndefined();
  });
});
