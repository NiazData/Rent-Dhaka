import { LISTING_PHOTOS_PREFIX, LISTINGS_TABLE, SITE_IMAGES_BUCKET, supabase } from "./supabase";
import type {
  Listing,
  ListingFilters,
  ListingInput,
  ListingPurpose,
  PropertyType,
} from "../types";

const VALID_PROPERTY_TYPES: PropertyType[] = ["apartment", "single-family", "condo", "townhome"];
const VALID_LISTING_PURPOSES: ListingPurpose[] = ["rent", "sale", "builder"];

interface ListingRow {
  id: string;
  slug: string;
  title: string;
  address: string;
  area: string;
  rent_bdt: number;
  deposit_bdt: number;
  beds: number;
  baths: number;
  sqft: number;
  available_from: string;
  property_type: PropertyType;
  listing_purpose: ListingPurpose;
  pet_policy: string;
  parking: string;
  amenities: string[];
  utilities_info: string;
  lease_terms: string;
  photos: string[];
  lat: number;
  lng: number;
  virtual_tour_url: string | null;
}

function rowToListing(row: ListingRow): Listing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    address: row.address,
    area: row.area,
    rentBDT: row.rent_bdt,
    depositBDT: row.deposit_bdt,
    beds: row.beds,
    baths: row.baths,
    sqft: row.sqft,
    availableFrom: row.available_from,
    propertyType: row.property_type,
    listingPurpose: row.listing_purpose,
    petPolicy: row.pet_policy,
    parking: row.parking,
    amenities: row.amenities,
    utilitiesInfo: row.utilities_info,
    leaseTerms: row.lease_terms,
    photos: row.photos,
    lat: row.lat,
    lng: row.lng,
    virtualTourUrl: row.virtual_tour_url ?? undefined,
  };
}

function listingInputToRow(input: ListingInput): Omit<ListingRow, "id"> {
  return {
    slug: input.slug,
    title: input.title,
    address: input.address,
    area: input.area,
    rent_bdt: input.rentBDT,
    deposit_bdt: input.depositBDT,
    beds: input.beds,
    baths: input.baths,
    sqft: input.sqft,
    available_from: input.availableFrom,
    property_type: input.propertyType,
    listing_purpose: input.listingPurpose,
    pet_policy: input.petPolicy,
    parking: input.parking,
    amenities: input.amenities,
    utilities_info: input.utilitiesInfo,
    lease_terms: input.leaseTerms,
    photos: input.photos,
    lat: input.lat,
    lng: input.lng,
    virtual_tour_url: input.virtualTourUrl ?? null,
  };
}

function applyFilters(listings: Listing[], filters: ListingFilters): Listing[] {
  return listings.filter((listing) => {
    if (filters.minRentBDT !== undefined && listing.rentBDT < filters.minRentBDT) return false;
    if (filters.maxRentBDT !== undefined && listing.rentBDT > filters.maxRentBDT) return false;
    if (filters.area && !listing.area.toLowerCase().includes(filters.area.toLowerCase())) return false;
    if (filters.minBeds !== undefined && listing.beds < filters.minBeds) return false;
    if (filters.minBaths !== undefined && listing.baths < filters.minBaths) return false;
    if (filters.propertyType && listing.propertyType !== filters.propertyType) return false;
    if (filters.listingPurpose && listing.listingPurpose !== filters.listingPurpose) return false;
    if (filters.petsAllowed && listing.petPolicy.toLowerCase().includes("no pets")) return false;
    if (
      filters.availableBy &&
      new Date(listing.availableFrom).getTime() > new Date(filters.availableBy).getTime()
    ) {
      return false;
    }
    return true;
  });
}

async function getAllListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from(LISTINGS_TABLE)
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return (data as ListingRow[]).map(rowToListing);
}

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const all = await getAllListings();
  return applyFilters(all, filters);
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  const { data, error } = await supabase
    .from(LISTINGS_TABLE)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return undefined;
  return rowToListing(data as ListingRow);
}

export async function getFeaturedListings(limit = 3): Promise<Listing[]> {
  const { data, error } = await supabase
    .from(LISTINGS_TABLE)
    .select("*")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error || !data) return [];
  return (data as ListingRow[]).map(rowToListing);
}

export async function createListing(input: ListingInput): Promise<Listing> {
  const { data, error } = await supabase
    .from(LISTINGS_TABLE)
    .insert(listingInputToRow(input))
    .select("*")
    .single();

  if (error || !data) throw error ?? new Error("Failed to create listing");
  return rowToListing(data as ListingRow);
}

export async function updateListing(id: string, input: ListingInput): Promise<Listing> {
  const { data, error } = await supabase
    .from(LISTINGS_TABLE)
    .update(listingInputToRow(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) throw error ?? new Error("Failed to update listing");
  return rowToListing(data as ListingRow);
}

export async function deleteListing(id: string): Promise<void> {
  const { error } = await supabase.from(LISTINGS_TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function uploadListingPhoto(slug: string, file: File): Promise<string> {
  const path = `${LISTING_PHOTOS_PREFIX}/${slug}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(SITE_IMAGES_BUCKET).upload(path, file);
  if (error) throw error;

  const { data } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function parseListingFiltersFromSearchParams(params: URLSearchParams): ListingFilters {
  const filters: ListingFilters = {};

  const minRentBDT = params.get("minRentBDT");
  const maxRentBDT = params.get("maxRentBDT");
  const area = params.get("area");
  const minBeds = params.get("minBeds");
  const minBaths = params.get("minBaths");
  const propertyType = params.get("propertyType");
  const listingPurpose = params.get("listingPurpose");
  const petsAllowed = params.get("petsAllowed");
  const availableBy = params.get("availableBy");

  if (minRentBDT !== null) filters.minRentBDT = Number(minRentBDT);
  if (maxRentBDT !== null) filters.maxRentBDT = Number(maxRentBDT);
  if (area !== null) filters.area = area;
  if (minBeds !== null) filters.minBeds = Number(minBeds);
  if (minBaths !== null) filters.minBaths = Number(minBaths);
  if (propertyType !== null && VALID_PROPERTY_TYPES.includes(propertyType as PropertyType)) {
    filters.propertyType = propertyType as PropertyType;
  }
  if (listingPurpose !== null && VALID_LISTING_PURPOSES.includes(listingPurpose as ListingPurpose)) {
    filters.listingPurpose = listingPurpose as ListingPurpose;
  }
  if (petsAllowed !== null) filters.petsAllowed = petsAllowed === "true";
  if (availableBy !== null) filters.availableBy = availableBy;

  return filters;
}
