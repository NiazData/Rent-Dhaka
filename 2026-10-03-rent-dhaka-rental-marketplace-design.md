# Rent Dhaka — Rental Marketplace Website Design Spec

Date: 2026-10-03

## 1. Intent

Build a modern, responsive rental property marketplace website for the Dhaka,
Bangladesh market, inspired by the UX patterns of sampotti.com (large property
marketplace) and rento-bd.com (smart property/building management). The goal
is a polished public-facing marketing + listings site that lets prospective
renters browse and filter properties, view rich property detail pages, and
submit a rental application or tour request — without needing a backend.

Success criteria:
- Looks and feels like a premium, modern real-estate/SaaS product, not a
  generic template site.
- Fully responsive, mobile-first, accessible.
- Property search/filtering and application flow work end-to-end using only
  static, hardcoded data plus Netlify Forms (no custom backend, no database).
- The data layer is structured so a real backend (e.g. Supabase) and a live
  admin panel can be added later as a pure addition, without rewriting pages
  or components.

## 2. Explicit scope

### In scope (this build)
- Marketing homepage (hero, search entry point, featured listings, service
  area, trust/credibility section, CTAs)
- Property search & listings page with filters (rent range, Dhaka area,
  bedrooms, bathrooms, property type, pet policy, availability) and a
  list-view ↔ map-view toggle
- Property detail pages (photo gallery, key facts, amenities, description,
  map, Apply Now / Schedule Tour)
- Online rental application: multi-step guest flow (Personal → Employment →
  Rental History → Documents → Review → Submit), submitted via Netlify Forms
- Schedule-a-tour request (lightweight form, also via Netlify Forms)
- Property-type SEO landing pages (Apartments, Single-Family Homes, Condos,
  Townhomes) with genuinely useful, distinct content per type
- Trust & credibility content: company story, team, service area, contact
- About / Contact pages, privacy policy, 404 page
- Mobile-first responsive design, accessibility basics, HTTPS (via Netlify)

### Explicitly deferred (per prior scoping notes)
- Tenant portal (rent payment, payment history, maintenance tracking, lease
  documents, announcements)
- Owner portal (portfolio performance, occupancy, financial reports)
- Online rent payment processing
- Maintenance request/ticketing system
- Owner/property-manager lead-generation section
- City-specific property-management SEO pages (e.g. "Gulshan Property
  Management") — only property-*type* pages are built now
- Any live admin panel UI or authentication (see §3)

## 3. Admin panel resolution

No backend exists in this phase, so there is no database to authenticate
against or persist changes to. Decision: **no live admin UI is built now.**
Content (listings, testimonials, team bios, property-type copy) lives in
typed TypeScript data files under `src/data/`. The site owner edits those
files directly and pushes; Netlify auto-deploys.

This is made forward-compatible by a repository/data-access layer
(`src/lib/listings-repository.ts` and siblings) that every page/component
calls instead of importing data files directly. Those functions
(`getListings(filters)`, `getListingBySlug(slug)`, `getTestimonials()`, etc.)
today just filter/return the in-memory arrays. When a real backend is added
later, only the internals of this layer change to call Supabase (or another
provider) — no page or component needs to change. At that point a real admin
panel (single admin account, per prior scoping discussion) and persistent
application storage become a pure addition.

## 4. Architecture

- **Framework:** Vite + React + TypeScript, React Router for routing.
- **Styling:** Tailwind CSS + shadcn/ui components — consistent with the
  user's other projects (E-comm, Portfolio), fast path to a polished,
  consistent "luxury real estate + modern SaaS" look.
- **Data:** Hardcoded, typed TS modules under `src/data/` (listings,
  testimonials, team, property-type info), accessed only through
  `src/lib/*-repository.ts` functions (see §3).
- **Forms:** Rental applications and tour requests submit via Netlify Forms
  (no backend code; submissions land in the Netlify dashboard with optional
  email notification). This is a genuinely functional mechanism, not a
  simulated/demo submission.
- **Maps:** Leaflet + OpenStreetMap tiles for the detail-page map and the
  list↔map toggle on the search page — no API key or billing setup required.
- **Hosting:** Netlify, matching the user's existing project deployment
  pattern.
- **Images:** Royalty-free stock photography (e.g. Unsplash) referenced by
  URL for placeholder listings; no image upload/storage needed since there
  is no backend.

## 5. Pages / routes

| Route | Purpose |
|---|---|
| `/` | Home: hero + search bar, featured listings, service area, property types, trust section, CTAs |
| `/listings` | Search & browse: filter sidebar, list view ↔ map view |
| `/listings/:slug` | Property detail: gallery → price/facts → amenities → description → map → Apply/Tour |
| `/apply/:slug` | Multi-step rental application (guest flow) |
| Tour request modal (opened from `/listings/:slug`) | Lightweight tour request form, no dedicated route |
| `/property-types/:type` | SEO landing pages: Apartments, Single-Family Homes, Condos, Townhomes |
| `/about` | Company story, team, years in business, service area |
| `/contact` | Contact info, office location/map, phone/WhatsApp click-to-contact |
| `/privacy` | Privacy policy |
| `*` | 404 page |

## 6. Data model (hardcoded, typed)

```ts
interface Listing {
  id: string;
  slug: string;
  title: string;
  address: string;
  area: string; // Dhaka neighborhood, e.g. "Gulshan 2"
  rentBDT: number;
  depositBDT: number;
  beds: number;
  baths: number;
  sqft: number;
  availableFrom: string; // ISO date
  propertyType: "apartment" | "single-family" | "condo" | "townhome";
  petPolicy: string;
  parking: string;
  amenities: string[];
  utilitiesInfo: string;
  leaseTerms: string;
  photos: string[]; // URLs
  lat: number;
  lng: number;
  virtualTourUrl?: string;
}

interface Testimonial { id: string; name: string; quote: string; rating: number; }
interface TeamMember { id: string; name: string; role: string; photo: string; bio: string; }
interface PropertyTypeInfo { type: Listing["propertyType"]; title: string; description: string; heroImage: string; }
```

Seed data: 6-10 realistic sample Dhaka-area listings across the supported
property types and a spread of neighborhoods (e.g. Gulshan, Dhanmondi,
Banani, Uttara, Bashundhara, Mirpur), priced in BDT.

## 7. Styling / UX direction

- Tailwind CSS + shadcn/ui; neutral/cream base palette with one accent color
  (deep terracotta or forest-green direction — finalized during
  implementation, easy to adjust via Tailwind theme tokens).
- Clean editorial typography, large property photography, generous
  whitespace, soft shadows, rounded cards, minimal animation.
- Mobile-first: sticky "Apply Now" bar on detail pages on mobile, swipeable
  photo galleries, one-tap call/WhatsApp buttons, easy filter access.

## 8. Accessibility & security

- Semantic heading structure, alt text on all images, visible focus
  indicators, keyboard-navigable filters and photo galleries, respects
  `prefers-reduced-motion`, accessible form labeling/error states.
- No sensitive applicant data stored in the site/repo itself — Netlify Forms
  handles submission storage off-platform; privacy policy explains this.
- HTTPS by default via Netlify.
- Out of scope for now (noted for the future backend phase): role-based
  access control, audit logs, secure document storage, session management —
  none of these are needed without a backend, and the data-layer abstraction
  in §3/§4 is what keeps adding them later from requiring a rewrite.

## 9. Testing / verification approach

No backend to unit-test. Verification for this project means:
- TypeScript strict mode catching data-shape errors across `src/data/`
- Manual responsive pass across mobile/tablet/desktop breakpoints
- Manual accessibility pass (keyboard nav, screen reader spot-check,
  contrast)
- Lighthouse check (performance/accessibility/SEO) before considering a
  phase done
- Manual end-to-end check that the application and tour-request forms
  actually submit successfully to Netlify Forms in a deployed preview
