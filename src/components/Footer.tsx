import { Link } from "react-router-dom";
import { getAllPropertyTypes } from "../lib/content-repository";

const propertyTypeLinks = getAllPropertyTypes().map((pt) => ({
  to: `/property-types/${pt.type}`,
  label: pt.title,
}));

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-stone-600">
        <p className="font-semibold text-stone-900">Rent Dhaka</p>
        <p className="mt-1">Helping renters find verified homes across Dhaka.</p>
        <nav aria-label="Browse by property type" className="mt-4">
          <p className="font-medium text-stone-900">Browse by Property Type</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {propertyTypeLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-accent-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
