import type { ListingFilters, PropertyType } from "../types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "single-family", label: "Single-Family Home" },
  { value: "condo", label: "Condo" },
  { value: "townhome", label: "Townhome" },
];

interface ListingFilterSidebarProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

export function ListingFilterSidebar({ filters, onChange }: ListingFilterSidebarProps) {
  function update<K extends keyof ListingFilters>(key: K, value: ListingFilters[K] | undefined) {
    const next: ListingFilters = { ...filters };
    if (value === undefined) {
      delete next[key];
    } else {
      next[key] = value;
    }
    onChange(next);
  }

  return (
    <aside
      aria-label="Filter listings"
      className="w-full space-y-4 rounded-lg border border-stone-200 p-4 md:w-64"
    >
      <div>
        <Label htmlFor="filter-min-rent">Min rent (BDT)</Label>
        <Input
          id="filter-min-rent"
          type="number"
          defaultValue={filters.minRentBDT ?? ""}
          onChange={(e) =>
            update("minRentBDT", e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>
      <div>
        <Label htmlFor="filter-max-rent">Max rent (BDT)</Label>
        <Input
          id="filter-max-rent"
          type="number"
          defaultValue={filters.maxRentBDT ?? ""}
          onChange={(e) =>
            update("maxRentBDT", e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>
      <div>
        <Label htmlFor="filter-area">Area</Label>
        <Input
          id="filter-area"
          defaultValue={filters.area ?? ""}
          onChange={(e) => update("area", e.target.value || undefined)}
        />
      </div>
      <div>
        <Label htmlFor="filter-min-beds">Min beds</Label>
        <select
          id="filter-min-beds"
          value={filters.minBeds ?? ""}
          onChange={(e) => update("minBeds", e.target.value ? Number(e.target.value) : undefined)}
          className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="filter-min-baths">Min baths</Label>
        <select
          id="filter-min-baths"
          value={filters.minBaths ?? ""}
          onChange={(e) => update("minBaths", e.target.value ? Number(e.target.value) : undefined)}
          className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="filter-property-type">Property type</Label>
        <select
          id="filter-property-type"
          value={filters.propertyType ?? ""}
          onChange={(e) =>
            update("propertyType", (e.target.value || undefined) as PropertyType | undefined)
          }
          className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
        >
          <option value="">Any</option>
          {PROPERTY_TYPES.map((pt) => (
            <option key={pt.value} value={pt.value}>
              {pt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="filter-pets-allowed"
          checked={filters.petsAllowed ?? false}
          onCheckedChange={(checked) => update("petsAllowed", checked === true ? true : undefined)}
        />
        <Label htmlFor="filter-pets-allowed">Pets allowed</Label>
      </div>
    </aside>
  );
}
