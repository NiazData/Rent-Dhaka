import { Link } from "react-router-dom";

interface StickyApplyBarProps {
  listingSlug: string;
  onScheduleTour: () => void;
}

export function StickyApplyBar({ listingSlug, onScheduleTour }: StickyApplyBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-stone-200 bg-white p-3 md:hidden">
      <button
        type="button"
        onClick={onScheduleTour}
        className="flex h-12 flex-1 items-center justify-center rounded-md border border-stone-300 bg-white text-base font-medium text-stone-900"
      >
        Schedule Tour
      </button>
      <Link
        to={`/apply/${listingSlug}`}
        className="flex h-12 flex-1 items-center justify-center rounded-md bg-accent-600 text-base font-medium text-white"
      >
        Apply Now
      </Link>
    </div>
  );
}
