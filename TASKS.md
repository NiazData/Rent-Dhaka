# Tasks — Rent Dhaka

Status as of 2026-10-05. Update this file when scope changes — it's a
snapshot, not a ticket system.

## Done

- Core site: Home, Listings (filter sidebar + list/map toggle), Listing
  Detail (gallery, map, Schedule Tour, Apply), multi-step Application,
  Property-Type SEO pages, About, Contact, Privacy.
- Netlify Forms wiring for Contact, Schedule Tour, and Application.
- Header business-line navigation (Rent / Sell / Barakah Property
  Management / BarakahAid / Connect Builders) with light pastel pill
  styling; Barakah Property Management and BarakahAid are placeholder
  "coming soon" pages.
- Supabase Auth admin login (`/admin/login`), `RequireAdmin` route
  guard, 15-minute site-wide inactivity auto-logout, header
  "Admin Panel" link shown whenever a session is active.
- Listings migrated from a hardcoded TS array to a Supabase `listings`
  table; `listings-repository.ts` fully async; every listing-backed
  page converted to fetch via `useListings`/`useListing`.
- Admin CRUD panel: stats, Overview/Listings tabs, data table, modal
  add/edit form with integrated photo upload (mirrors the author's
  e-commerce admin dashboard pattern) — covers Rent, Sell, and Connect
  Builders identically.
- `site-images` Storage bucket + RLS policies (migration 0002) — fixes
  the "Bucket not found" upload failure.
- Fixed: Connect Builders page no longer hard-codes a static "Coming
  Soon" card; it now renders real `listingPurpose=builder` listings the
  same way Rent and Sell do.
- Real "Sell" listing (Mohammadpur apartment) and 3 real "Rent" listings
  (Flat A/B/C, Bosila Garden City) seeded, replacing earlier fictional
  sample data.
- Project docs added: PRD, ARCHITECTURE, DESIGN-SYSTEM, RULES, AGENTS,
  TASKS, MEMORY (this set).

## Open / backlog

- **Slug sanitization in the admin form.** Nothing currently
  lowercases/hyphenates the `slug` field — an admin can save a slug
  with spaces or capitals (e.g. `"Construction- On going"`), which
  still works (exact-string match, URL-encoded) but produces ugly
  URLs. Flagged to the owner, not yet actioned either way.
- **Barakah Property Management and BarakahAid** are still
  `ComingSoonPage` stubs with no data model or admin surface — out of
  scope until those business lines are actually scoped (see PRD.md).
- **No in-app way to invite a second admin.** Account creation is
  manual via the Supabase dashboard by design (see RULES.md); an
  "admin invites another admin" flow would be new scope, not a bug.
- **Bundle size warning**: the production build emits one ~685 KB JS
  chunk (Vite's 500 KB warning). Not yet addressed — would need route-
  based `import()` code-splitting (e.g. the admin panel, which a public
  visitor never loads, is the obvious first split).
- **No automated deposit/available-date/pet-policy validation** beyond
  basic required-field checks in the admin form — these are free-text
  or numeric inputs with no business-rule validation layer.
