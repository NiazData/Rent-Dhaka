import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-stone-600">
        <p className="font-semibold text-stone-900">Rent Dhaka</p>
        <p className="mt-1">Helping renters find verified homes across Dhaka.</p>
        <nav aria-label="Footer" className="mt-4 flex gap-4">
          <Link to="/privacy" className="hover:text-accent-600">
            Privacy Policy
          </Link>
          <Link to="/contact" className="hover:text-accent-600">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}
