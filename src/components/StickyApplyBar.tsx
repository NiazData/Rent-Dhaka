import { Link } from "react-router-dom";

export function StickyApplyBar({ listingSlug }: { listingSlug: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white p-3 md:hidden">
      <Link
        to={`/apply/${listingSlug}`}
        className="flex h-12 w-full items-center justify-center rounded-md bg-accent-600 text-base font-medium text-white"
      >
        Apply Now
      </Link>
    </div>
  );
}
