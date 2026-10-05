import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { uploadListingPhoto } from "../../lib/listings-repository";
import { Button } from "../ui/button";
import type { Listing, ListingInput, ListingPurpose, PropertyType } from "../../types";

const PROPERTY_TYPES: PropertyType[] = ["apartment", "single-family", "condo", "townhome"];
const LISTING_PURPOSES: ListingPurpose[] = ["rent", "sale", "builder"];

function toFormState(listing: Listing | null) {
  return {
    slug: listing?.slug ?? "",
    title: listing?.title ?? "",
    address: listing?.address ?? "",
    area: listing?.area ?? "",
    rentBDT: listing?.rentBDT.toString() ?? "",
    depositBDT: listing?.depositBDT.toString() ?? "",
    beds: listing?.beds.toString() ?? "",
    baths: listing?.baths.toString() ?? "",
    sqft: listing?.sqft.toString() ?? "",
    availableFrom: listing?.availableFrom ?? "",
    propertyType: listing?.propertyType ?? "apartment",
    listingPurpose: listing?.listingPurpose ?? "rent",
    petPolicy: listing?.petPolicy ?? "N/A",
    parking: listing?.parking ?? "N/A",
    amenities: listing?.amenities.join(", ") ?? "",
    utilitiesInfo: listing?.utilitiesInfo ?? "",
    leaseTerms: listing?.leaseTerms ?? "",
    lat: listing?.lat.toString() ?? "",
    lng: listing?.lng.toString() ?? "",
  };
}

type FormState = ReturnType<typeof toFormState>;

const FIELD_CLASS =
  "mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500";
const LABEL_CLASS = "block text-sm font-medium text-stone-700";

interface ListingFormModalProps {
  listing: Listing | null;
  onClose: () => void;
  onSaved: (input: ListingInput) => Promise<void>;
}

export function ListingFormModal({ listing, onClose, onSaved }: ListingFormModalProps) {
  const isEdit = !!listing;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<FormState>(toFormState(listing));
  const [photos, setPhotos] = useState<string[]>(listing?.photos ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleChange(key: keyof FormState) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => update(key, event.target.value);
  }

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    if (!values.slug.trim()) {
      setError("Enter a slug before uploading photos.");
      return;
    }

    setUploading(true);
    setError("");
    const uploaded: string[] = [];
    for (const file of files) {
      try {
        uploaded.push(await uploadListingPhoto(values.slug.trim(), file));
      } catch {
        setError("Photo upload failed. Please try again.");
        break;
      }
    }
    setPhotos((prev) => [...prev, ...uploaded]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const input: ListingInput = {
      slug: values.slug.trim(),
      title: values.title.trim(),
      address: values.address.trim(),
      area: values.area.trim(),
      rentBDT: Number(values.rentBDT),
      depositBDT: Number(values.depositBDT),
      beds: Number(values.beds),
      baths: Number(values.baths),
      sqft: Number(values.sqft),
      availableFrom: values.availableFrom,
      propertyType: values.propertyType as PropertyType,
      listingPurpose: values.listingPurpose as ListingPurpose,
      petPolicy: values.petPolicy.trim(),
      parking: values.parking.trim(),
      amenities: values.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      utilitiesInfo: values.utilitiesInfo.trim(),
      leaseTerms: values.leaseTerms.trim(),
      photos,
      lat: Number(values.lat),
      lng: Number(values.lng),
    };

    try {
      await onSaved(input);
    } catch {
      setError("Failed to save listing. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 p-6">
          <h2 className="text-xl font-semibold text-stone-900">{isEdit ? "Edit Listing" : "Add Listing"}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-stone-500 hover:text-stone-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className={LABEL_CLASS}>Photos</label>
            {photos.length > 0 && (
              <div className="mb-3 mt-2 flex flex-wrap gap-3">
                {photos.map((url, index) => (
                  <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-stone-200">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => removePhoto(index)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileInputRef}
              id="listing-photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
              aria-label="Upload photos"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-300 px-4 py-3 text-sm text-stone-500 transition-colors hover:border-accent-400 hover:text-accent-600 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Click to upload photos
                </>
              )}
            </button>
            {photos.length === 0 && (
              <p className="mt-1 flex items-center gap-1 text-xs text-stone-400">
                <ImageIcon className="h-3 w-3" /> No photos yet — upload at least one when ready
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={LABEL_CLASS}>
              Slug *
              <input required value={values.slug} onChange={handleChange("slug")} className={FIELD_CLASS} />
            </label>
            <label className={LABEL_CLASS}>
              Title *
              <input required value={values.title} onChange={handleChange("title")} className={FIELD_CLASS} />
            </label>
          </div>

          <label className={LABEL_CLASS}>
            Address *
            <input required value={values.address} onChange={handleChange("address")} className={FIELD_CLASS} />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={LABEL_CLASS}>
              Area *
              <input required value={values.area} onChange={handleChange("area")} className={FIELD_CLASS} />
            </label>
            <label className={LABEL_CLASS}>
              Listing purpose *
              <select value={values.listingPurpose} onChange={handleChange("listingPurpose")} className={FIELD_CLASS}>
                {LISTING_PURPOSES.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className={LABEL_CLASS}>
              Property type *
              <select value={values.propertyType} onChange={handleChange("propertyType")} className={FIELD_CLASS}>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className={LABEL_CLASS}>
              Available from *
              <input
                required
                type="date"
                value={values.availableFrom}
                onChange={handleChange("availableFrom")}
                className={FIELD_CLASS}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className={LABEL_CLASS}>
              Rent / Price (BDT) *
              <input
                required
                type="number"
                min="0"
                value={values.rentBDT}
                onChange={handleChange("rentBDT")}
                className={FIELD_CLASS}
              />
            </label>
            <label className={LABEL_CLASS}>
              Deposit (BDT) *
              <input
                required
                type="number"
                min="0"
                value={values.depositBDT}
                onChange={handleChange("depositBDT")}
                className={FIELD_CLASS}
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label className={LABEL_CLASS}>
              Beds *
              <input required type="number" min="0" value={values.beds} onChange={handleChange("beds")} className={FIELD_CLASS} />
            </label>
            <label className={LABEL_CLASS}>
              Baths *
              <input
                required
                type="number"
                min="0"
                value={values.baths}
                onChange={handleChange("baths")}
                className={FIELD_CLASS}
              />
            </label>
            <label className={LABEL_CLASS}>
              Sqft *
              <input required type="number" min="0" value={values.sqft} onChange={handleChange("sqft")} className={FIELD_CLASS} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className={LABEL_CLASS}>
              Pet policy
              <input value={values.petPolicy} onChange={handleChange("petPolicy")} className={FIELD_CLASS} />
            </label>
            <label className={LABEL_CLASS}>
              Parking
              <input value={values.parking} onChange={handleChange("parking")} className={FIELD_CLASS} />
            </label>
          </div>

          <label className={LABEL_CLASS}>
            Amenities (comma-separated)
            <input value={values.amenities} onChange={handleChange("amenities")} className={FIELD_CLASS} />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className={LABEL_CLASS}>
              Utilities info
              <input value={values.utilitiesInfo} onChange={handleChange("utilitiesInfo")} className={FIELD_CLASS} />
            </label>
            <label className={LABEL_CLASS}>
              Lease terms
              <input value={values.leaseTerms} onChange={handleChange("leaseTerms")} className={FIELD_CLASS} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className={LABEL_CLASS}>
              Latitude *
              <input required type="number" step="any" value={values.lat} onChange={handleChange("lat")} className={FIELD_CLASS} />
            </label>
            <label className={LABEL_CLASS}>
              Longitude *
              <input required type="number" step="any" value={values.lng} onChange={handleChange("lng")} className={FIELD_CLASS} />
            </label>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving || uploading}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
