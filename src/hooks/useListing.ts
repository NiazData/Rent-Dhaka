import { useEffect, useState } from "react";
import { getListingBySlug } from "../lib/listings-repository";
import type { Listing } from "../types";

export interface UseListingResult {
  listing: Listing | undefined;
  loading: boolean;
}

export function useListing(slug: string | undefined): UseListingResult {
  const [listing, setListing] = useState<Listing | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setListing(undefined);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    getListingBySlug(slug).then((result) => {
      if (!active) return;
      setListing(result);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  return { listing, loading };
}
