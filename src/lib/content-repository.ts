import { testimonials } from "../data/testimonials";
import { teamMembers } from "../data/team";
import { propertyTypes } from "../data/propertyTypes";
import type { PropertyTypeInfo, TeamMember, Testimonial } from "../types";

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

export function getTeamMembers(): TeamMember[] {
  return teamMembers;
}

export function getAllPropertyTypes(): PropertyTypeInfo[] {
  return propertyTypes;
}

export function getPropertyTypeInfo(type: string): PropertyTypeInfo | undefined {
  return propertyTypes.find((info) => info.type === type);
}
