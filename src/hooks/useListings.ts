import { useEffect, useState } from "react";
import { getListings } from "../lib/listings-repository";
import type { Listing, ListingFilters } from "../types";

export interface UseListingsResult {
  listings: Listing[];
  loading: boolean;
}

export function useListings(filters: ListingFilters = {}): UseListingsResult {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getListings(filters).then((result) => {
      if (!active) return;
      setListings(result);
      setLoading(false);
    });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return { listings, loading };
}
