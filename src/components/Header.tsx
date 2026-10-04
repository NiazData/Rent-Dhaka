import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 md:flex-row md:justify-between md:gap-6">
        <nav
          aria-label="Business lines"
          className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-stone-700 md:order-1 md:justify-start"
        >
          <Link to="/listings?listingPurpose=rent" className="hover:text-accent-600">
            Rent
          </Link>
          <Link to="/listings?listingPurpose=sale" className="hover:text-accent-600">
            Sell
          </Link>
          <Link to="/barakah-property-solutions" className="hover:text-accent-600">
            Barakah Property Solutions
          </Link>
          <Link to="/barakahaid" className="hover:text-accent-600">
            BarakahAid
          </Link>
          <Link to="/listings?listingPurpose=builder" className="hover:text-accent-600">
            Connect Builders
          </Link>
        </nav>

        <Link
          to="/"
          className="order-first text-2xl font-extrabold tracking-wide text-accent-700 md:order-2 md:text-3xl"
        >
          RENT DHAKA
        </Link>

        <nav
          aria-label="Main"
          className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-stone-700 md:order-3 md:justify-end"
        >
          <Link to="/about" className="hover:text-accent-600">
            About
          </Link>
          <Link to="/contact" className="hover:text-accent-600">
            Contact
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-accent-600 px-3 py-1 text-accent-700 hover:bg-accent-50"
          >
            Login / Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
