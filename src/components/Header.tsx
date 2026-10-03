import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold text-accent-700">
          Rent Dhaka
        </Link>
        <nav aria-label="Main" className="flex gap-6 text-sm font-medium text-stone-700">
          <Link to="/" className="hover:text-accent-600">
            Home
          </Link>
          <Link to="/listings" className="hover:text-accent-600">
            Listings
          </Link>
          <Link to="/about" className="hover:text-accent-600">
            About
          </Link>
          <Link to="/contact" className="hover:text-accent-600">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
