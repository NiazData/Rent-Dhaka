import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "single-family", label: "Single-Family Home" },
  { value: "condo", label: "Condo" },
  { value: "townhome", label: "Townhome" },
];

export function HeroSearch() {
  const navigate = useNavigate();
  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxRentBDT, setMaxRentBDT] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (area) params.set("area", area);
    if (propertyType) params.set("propertyType", propertyType);
    if (maxRentBDT) params.set("maxRentBDT", maxRentBDT);
    navigate(`/listings?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-md md:flex-row md:items-end"
    >
      <div className="flex-1">
        <Label htmlFor="hero-area">Area</Label>
        <Input
          id="hero-area"
          placeholder="e.g. Gulshan 2"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="hero-property-type">Property type</Label>
        <select
          id="hero-property-type"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
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
      <div className="flex-1">
        <Label htmlFor="hero-max-rent">Max rent (BDT)</Label>
        <Input
          id="hero-max-rent"
          type="number"
          placeholder="e.g. 60000"
          value={maxRentBDT}
          onChange={(e) => setMaxRentBDT(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg">
        Find a Property
      </Button>
    </form>
  );
}
