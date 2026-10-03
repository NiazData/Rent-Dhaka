export type PropertyType = "apartment" | "single-family" | "condo" | "townhome";

export interface Listing {
  id: string;
  slug: string;
  title: string;
  address: string;
  area: string;
  rentBDT: number;
  depositBDT: number;
  beds: number;
  baths: number;
  sqft: number;
  availableFrom: string;
  propertyType: PropertyType;
  petPolicy: string;
  parking: string;
  amenities: string[];
  utilitiesInfo: string;
  leaseTerms: string;
  photos: string[];
  lat: number;
  lng: number;
  virtualTourUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
}

export interface PropertyTypeInfo {
  type: PropertyType;
  title: string;
  description: string;
  heroImage: string;
}

export interface ListingFilters {
  minRentBDT?: number;
  maxRentBDT?: number;
  area?: string;
  minBeds?: number;
  minBaths?: number;
  propertyType?: PropertyType;
  petsAllowed?: boolean;
  availableBy?: string;
}
