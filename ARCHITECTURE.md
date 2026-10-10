# Architecture — Iman Homes

## Stack

- **Frontend:** React 18 + TypeScript (strict) + Vite, React Router v6,
  Tailwind CSS, Radix UI primitives (Dialog/Checkbox/Progress) wrapped
  in local `src/components/ui/*`, `lucide-react` icons.
- **Backend:** Supabase — Postgres (`listings` table), Supabase Auth
  (email/password, admin-only), Supabase Storage (`site-images` bucket,
  public read).
- **Forms:** Netlify Forms (contact, schedule-tour, rental application)
  — see `src/lib/netlify-forms.ts`.
- **Hosting:** Netlify, static build (`vite build` → `dist/`), deployed
  via the Netlify CLI (`netlify deploy --prod --dir=dist`).
- **Testing:** Vitest + React Testing Library + jest-axe.

## Data model

Single source of truth: the Supabase `listings` table (see
`supabase/migrations/0001_listings.sql`). One table covers all three
live business lines; a `listing_purpose` column (`rent` | `sale` |
`builder`) is the only thing that routes a row to Rent, Sell, or
Connect Builders.

```
listings
  id uuid pk, slug text unique, title, address, area,
  rent_bdt, deposit_bdt, beds, baths, sqft, available_from date,
  property_type (apartment|single-family|condo|townhome),
  listing_purpose (rent|sale|builder),
  pet_policy, parking, amenities text[], utilities_info, lease_terms,
  photos text[], lat, lng, virtual_tour_url, created_at
```

RLS: public (`anon`/`authenticated`) can `select`; only `authenticated`
(i.e. a logged-in admin) can `insert`/`update`/`delete`.

Photos live in the `site-images` Storage bucket under
`listings/<slug>/<timestamp>-<filename>`, public URLs stored directly in
the `photos` array (see `supabase/migrations/0002_site_images_bucket.sql`
for the bucket + its RLS policies — same public-read/authenticated-write
split).

## Data access layer

`src/lib/listings-repository.ts` is the only module that talks to the
`listings` table or `site-images` bucket. It is fully async (every
function returns a Promise) and exports:

- `getListings(filters?)` / `getListingBySlug(slug)` /
  `getFeaturedListings(limit)` — reads. `getListings` fetches all rows
  then filters client-side in JS (the dataset is small; this keeps one
  predictable filter implementation instead of duplicating it in SQL).
- `createListing` / `updateListing` / `deleteListing` — admin writes.
- `uploadListingPhoto(slug, file)` — uploads to Storage, returns the
  public URL (caller is responsible for appending it to the listing's
  `photos` array via `updateListing`).
- `parseListingFiltersFromSearchParams(params)` — pure URL-param parser,
  no network call.

Pages never import `@supabase/supabase-js` or the `listings` table
directly — they go through this module, and through two thin hooks:

- `src/hooks/useListings.ts` — `{ listings, loading }` for a given
  `ListingFilters` object (used by `ListingsPage`, `PropertyTypePage`).
- `src/hooks/useListing.ts` — `{ listing, loading }` for a single slug
  (used by `ListingDetailPage`, `ApplicationPage`).

`FeaturedListings` fetches directly via `getFeaturedListings` since it
needs no filters.

## Auth

- `src/lib/supabase.ts` creates the single `supabase` client from
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (`.env`, gitignored).
- `src/hooks/useSession.ts` wraps `supabase.auth.getSession()` +
  `onAuthStateChange`.
- `src/components/RequireAdmin.tsx` gates the `/admin` route — redirects
  to `/admin/login` when there's no session.
- `src/pages/admin/AdminLoginPage.tsx` — email/password sign-in only.
  **There is no signup page.** Admin accounts are created manually in
  the Supabase dashboard (Authentication → Users → Add user, with Auto
  Confirm checked).
- `src/hooks/useInactivityLogout.ts` — mounted once in `Layout.tsx` (so
  it's active on every route, not just `/admin`). Signs the admin out
  and redirects to `/admin/login?reason=timeout` after 15 minutes with
  no mouse/keyboard/scroll/touch activity, but only when a session
  exists (no-op for anonymous visitors).
- `Header.tsx` shows an "Admin Panel" link instead of "Login / Sign Up"
  whenever `useSession()` reports a session, so an admin can browse the
  public site and always get back to `/admin`.

## Routing

All routes are declared in `src/AppRoutes.tsx`, wrapped in `Layout`
(header/footer/skip-link chrome):

```
/                          HomePage (hero + featured listings + trust section)
/listings                  ListingsPage (filters, list/map toggle)
/listings/:slug            ListingDetailPage
/apply/:slug                ApplicationPage (multi-step)
/property-types/:type      PropertyTypePage (SEO page, rent-purpose only)
/about, /contact, /privacy  static pages
/barakah-property-solutions, /barakahaid, /login   ComingSoonPage stubs
/admin/login                AdminLoginPage
/admin                      RequireAdmin → AdminDashboardPage
*                           NotFoundPage
```

## Admin panel

`src/pages/admin/AdminDashboardPage.tsx` +
`src/components/admin/ListingFormModal.tsx`. Pattern deliberately
mirrors the author's other project (an e-commerce admin dashboard):
stat cards → tabs (Overview / Listings) → a data table with thumbnail,
purpose badge, price, beds/baths, and Edit/Delete icon buttons → a
modal (not inline) for add/edit, with photo upload integrated into the
same modal (upload-on-select with thumbnail previews and a hover-to-
remove ✕, matching that reference pattern). Colors use this project's
own `accent`/`stone` Tailwind tokens rather than the reference's blue/gray
— see DESIGN-SYSTEM.md.

## Testing architecture

- `src/test/listingFixtures.ts` — shared plain `Listing` fixtures
  (`FLAT_A`, `FLAT_B`, `FLAT_C`, `SALE_LISTING`, `BUILDER_LISTING`,
  `ALL_LISTINGS`) used across page-level tests.
- `src/test/fakeSupabaseTable.ts` — `createFakeListingsSupabase(listings)`
  builds a chainable fake (`select/eq/order/limit/insert/update/delete/
  single/maybeSingle`, thenable) that mimics the supabase-js query
  builder closely enough that the **real** `listings-repository.ts`
  filter logic runs unmocked against it. Tests mock `../lib/supabase`
  (never `../lib/listings-repository` directly) so the actual filtering/
  sorting code is exercised, not re-implemented in test doubles.
- Because every listing-backed page now fetches asynchronously, tests
  use `findBy*`/`waitFor` around the initial load instead of asserting
  synchronously on `render()`.

## Deployment

```
npm test && npm run build      # must be clean before anything below
git add <specific files>       # never git add -A
git commit -m "..."            # new commit, not --amend
git push origin master
netlify deploy --prod --dir=dist
```

Database/storage changes are **not** part of this flow — they live in
`supabase/migrations/*.sql` and must be run manually by the project
owner in the Supabase SQL Editor (no service-role key or DB connection
is available to automate this; see RULES.md).
