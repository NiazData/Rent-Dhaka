import { Link } from "react-router-dom";

const BUSINESS_LINKS = [
  {
    to: "/listings?listingPurpose=rent",
    label: "Rent",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
  {
    to: "/listings?listingPurpose=sale",
    label: "Sell",
    className: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
  },
  {
    to: "/barakah-property-solutions",
    label: "Barakah Property Management",
    className: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  {
    to: "/barakahaid",
    label: "BarakahAid",
    className: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  },
  {
    to: "/listings?listingPurpose=builder",
    label: "Connect Builders",
    className: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
  },
];

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 md:flex-row md:justify-between md:gap-6">
        <nav
          aria-label="Business lines"
          className="flex flex-wrap items-center justify-center gap-2 md:justify-start"
        >
          {BUSINESS_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${link.className}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav
          aria-label="Main"
          className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-stone-700"
        >
          <Link to="/" className="hover:text-accent-600">
            Home
          </Link>
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
