import { Link } from "react-router-dom";

const BUSINESS_LINKS = [
  {
    to: "/listings?listingPurpose=rent",
    label: "Rent",
    className: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    to: "/listings?listingPurpose=sale",
    label: "Sell",
    className: "bg-blue-600 hover:bg-blue-700",
  },
  {
    to: "/barakah-property-solutions",
    label: "Barakah Property Management",
    className: "bg-amber-600 hover:bg-amber-700",
  },
  {
    to: "/barakahaid",
    label: "BarakahAid",
    className: "bg-rose-600 hover:bg-rose-700",
  },
  {
    to: "/listings?listingPurpose=builder",
    label: "Connect Builders",
    className: "bg-violet-600 hover:bg-violet-700",
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
              className={`rounded-md px-3 py-1.5 text-sm font-medium text-white ${link.className}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav
          aria-label="Main"
          className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-stone-700"
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
