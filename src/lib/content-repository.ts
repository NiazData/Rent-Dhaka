import { testimonials } from "../data/testimonials";
import { propertyTypes } from "../data/propertyTypes";
import type { PropertyTypeInfo, Testimonial } from "../types";

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

export function getAllPropertyTypes(): PropertyTypeInfo[] {
  return propertyTypes;
}

export function getPropertyTypeInfo(type: string): PropertyTypeInfo | undefined {
  return propertyTypes.find((info) => info.type === type);
}
