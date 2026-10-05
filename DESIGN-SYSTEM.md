# Design System — Rent Dhaka

## Color tokens (`tailwind.config.js`)

- **`accent`** — custom terracotta/rust scale (50 → 900), the brand
  color. `accent-600` is the primary action color (buttons, active tab
  underline, focus rings); `accent-100`/`accent-50` for soft fills.
- **`stone`** — Tailwind's built-in neutral scale, used for all body
  text, borders, and backgrounds (`stone-900` headings, `stone-600`
  secondary text, `stone-200` borders, `stone-50`/`stone-100` subtle
  fills).
- **Business-line pill colors** (Header's `BUSINESS_LINKS`), each a
  light pastel `border/bg-50/text-700` triplet, reused for status
  badges elsewhere (e.g. the admin dashboard's purpose badges):
  - Rent → `emerald`
  - Sell → `sky`
  - Barakah Property Management → `amber`
  - BarakahAid → `rose`
  - Connect Builders → `violet`

## Typography

`Inter` (via `fontFamily.sans` in `tailwind.config.js`), system-ui
fallback. No custom type scale beyond Tailwind's defaults — headings use
`text-2xl`/`text-3xl font-bold text-stone-900`, body copy
`text-stone-600`.

## Components

- **`Button`** (`src/components/ui/button.tsx`, CVA-based):
  - `variant`: `primary` (accent-600 fill), `secondary` (stone-100
    fill), `outline` (stone-300 border, transparent).
  - `size`: `sm` (h-8), `default` (h-10), `lg` (h-12).
- **`Card`**, **`Dialog`**, **`Checkbox`**, **`Progress`** — thin
  wrappers around Radix primitives, styled with the same stone/accent
  tokens.
- **`Input`/`Label`/`Textarea`** — plain styled form primitives (no
  Radix) used throughout the application form and admin modal.

## Images

- **Listing photos always use `object-contain` on a `bg-stone-100`
  backdrop, never `object-cover`.** This was an explicit correction
  from the project owner ("you need to display these images as is, in
  the original size") after cropped/zoomed photos shipped once — do not
  reintroduce `object-cover` for listing imagery.
- **No-photo placeholder:** when a listing has zero photos, render a
  `stone-100` box with a centered `lucide-react` `ImageOff` icon
  (`text-stone-400`), `aria-hidden="true"`. Used in `ListingCard`,
  `PhotoGallery`, and the admin table's thumbnail column. There is no
  separate "coming soon" treatment anymore — an empty `photos` array is
  just a listing without a photo yet, shown the same way everywhere.
- Real listing photos live in Supabase Storage (`site-images` bucket);
  a handful of early seed photos are static files under
  `public/images/<section>/`. Never substitute stock/AI-generated
  photography — if a listing has no real photo, show the placeholder,
  don't fill it with a stock image.

## Layout conventions

- Page containers: `mx-auto max-w-6xl px-4 py-8/12` for most content
  pages, `max-w-4xl` for the admin dashboard, `max-w-xl`/`max-w-sm` for
  narrow forms (application steps, admin login).
- Grids: listing grids are `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.
- Admin modal: `fixed inset-0 bg-black/50` overlay, centered
  `max-w-2xl` white card, `max-h-[90vh] overflow-y-auto`.

## Accessibility

- Every interactive icon-only control has an `aria-label`
  (gallery prev/next, admin edit/delete, photo remove, modal close).
- Loading states use `role="status"` text, not a bare spinner, so
  screen readers and `findBy`-based tests both have something to key
  off of.
- `jest-axe` runs against Home, Listings, Listing Detail, About, and
  Contact in `src/test/a11y.test.tsx` — keep new pages added to that
  page set passing with zero violations.
