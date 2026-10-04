import { ImageOff } from "lucide-react";

export function ComingSoonListingCard({ photoSrc }: { photoSrc?: string }) {
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      {photoSrc ? (
        <img
          src={photoSrc}
          alt="Property under construction"
          className="h-64 w-full bg-stone-100 object-contain"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-64 w-full items-center justify-center bg-stone-100 text-stone-400"
        >
          <ImageOff className="h-10 w-10" />
        </div>
      )}
      <div className="p-6 text-center">
        <p className="text-lg font-semibold text-stone-900">Coming Soon</p>
      </div>
    </div>
  );
}
