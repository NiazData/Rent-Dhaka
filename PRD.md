# Product Requirements Document — Iman Homes

## Product

Iman Homes is a property marketplace for the Dhaka, Bangladesh rental and
sale market, operated under a single umbrella ("Barakah") covering several
related business lines. Live at https://imanhomes.com.

## Users

- **Visitors (public, unauthenticated):** browse and filter listings,
  view listing detail pages with photos and a map, schedule a tour,
  submit a rental application, read about the company, and contact the
  office.
- **Admin (single or small number of accounts):** the property
  owner/manager. Logs in to add, edit, and delete listings, and to
  upload/remove photos per listing. There is no tenant/buyer account
  system — visitors never log in.

## Business lines

Surfaced as pill buttons in the header, each routing into the shared
listings system via a `listingPurpose` filter unless noted otherwise:

| Line | Status | Route |
|---|---|---|
| Rent | Live | `/listings?listingPurpose=rent` |
| Sell | Live | `/listings?listingPurpose=sale` |
| Connect Builders | Live | `/listings?listingPurpose=builder` |
| Barakah Property Management | Placeholder ("coming soon") | `/barakah-property-solutions` |
| BarakahAid | Placeholder ("coming soon") | `/barakahaid` |

All three live business lines (Rent, Sell, Connect Builders) share one
`listings` data model and one admin CRUD interface — there is no special
casing between them in the product; a listing's `listingPurpose` field is
what routes it into the right section.

## Core features (current state)

- **Listings grid/map** with sidebar filters (rent range, area, beds,
  baths, property type, pets, available-by date) and a list/map toggle.
- **Listing detail page**: photo gallery (or a "no photo yet" placeholder
  if none uploaded), price, specs, amenities, pet policy, parking,
  utilities, lease terms, a map, Schedule Tour modal, and an Apply link.
- **Multi-step rental application** (Personal → Employment → Rental
  History → Documents → Review) submitted via Netlify Forms.
- **Schedule Tour** modal, also submitted via Netlify Forms.
- **Property-type SEO pages** (`/property-types/:type`) for
  apartment/single-family/condo/townhome, filtered to rent-purpose
  listings only.
- **About / Contact / Privacy** static content pages.
- **Admin panel** (`/admin`, gated by `/admin/login`):
  - Stats (total listings, counts by purpose).
  - Overview tab (recent listings) and Listings tab (full table).
  - Add/Edit via a modal form covering every listing field, with
    photo upload/remove built into the same modal.
  - Delete with a confirm prompt.
  - 15-minute site-wide inactivity auto-logout.
  - An "Admin Panel" link replaces "Login / Sign Up" in the header
    whenever a session is active, so the admin can browse the public
    site and get back to the dashboard without getting stuck.

## Explicitly out of scope (not built)

- Tenant/buyer accounts, messaging, or saved searches.
- Payments or deposits handled on-site.
- Public admin signup — admin accounts are created manually via the
  Supabase dashboard (Authentication → Users), not through the site.
- Barakah Property Management and BarakahAid are intentionally
  placeholder pages until those business lines are scoped.

## Success criteria

- The admin can add, edit, delete, and re-photograph any listing
  entirely through the admin panel — no code change or redeploy
  required for day-to-day listing management.
- What the admin sets for a listing's `listingPurpose` is the only
  thing that determines which business-line page it shows up on; there
  is no per-section special-casing left in the listings page to go out
  of sync with the data (this was a real bug — see MEMORY.md).
