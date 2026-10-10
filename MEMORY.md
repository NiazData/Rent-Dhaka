# Memory — Iman Homes

A decision log: what changed and **why**, so a future agent doesn't
undo a deliberate choice by mistake. Not a changelog of every edit —
`git log` is the changelog. This is for decisions whose reasoning isn't
obvious just from reading the current code.

## Photo handling

- **`object-contain`, never `object-cover`, for listing photos.** Early
  on, photos were cropped/zoomed with `object-cover`. The owner
  corrected this explicitly ("you need to display these images as is,
  in the original size") — fixed once, site-wide, and should not
  regress.
- **No stock/AI-generated photography, ever.** Multiple rounds of this
  project involved removing Unsplash stock photos (first from the
  Rent/Connect Builders sections specifically, later from every
  remaining listing and the property-type hero images) in favor of
  either a real photo or an explicit no-photo placeholder. This is a
  standing constraint, not a one-time cleanup.
- **The `site-images` Storage bucket didn't actually exist** when the
  admin photo-upload feature first shipped — the RLS policies were set
  up, but the bucket itself was never created via the Storage UI or SQL.
  This caused silent "Bucket not found" failures until diagnosed and
  fixed with migration `0002_site_images_bucket.sql`. If a future
  Storage-backed feature fails mysteriously, check bucket existence
  before assuming it's an RLS/permissions problem.

## Listings data

- **Moved from a hardcoded `src/data/listings.ts` array to a Supabase
  table.** The original build (an 18-task spec-driven project) seeded 8
  fictional "rent" listings plus a few fictional "sale"/"builder" ones
  purely as sample data. As the owner replaced these with real listings
  one request at a time, it became clear every listing change required
  a code edit + redeploy — defeating the point of having an admin
  panel. The data model moved to Supabase specifically so the admin
  panel could do real CRUD without agent involvement going forward.
- **The "Connect Builders" page used to hard-code a static "Coming
  Soon" card** (`COMING_SOON_PURPOSES` in `ListingsPage.tsx`),
  independent of whatever was actually in the `listings` table. This
  made sense when there were zero real builder listings and the owner
  explicitly wanted a placeholder with no fabricated content. It became
  a bug once the admin started adding real builder listings through the
  CRUD panel — the public page kept showing the old static photo
  regardless. Fixed by deleting the override entirely; Builder now
  renders exactly like Rent and Sell. **Don't reintroduce a
  purpose-specific display override** for any business line that has a
  working admin CRUD surface — if a section needs to look empty, that's
  what `EmptyListingsState` is for, driven by real (zero) row count,
  not a hard-coded branch.
- **Required-but-unspecified listing fields** (pet policy, parking,
  deposit, amenities, lease terms) get neutral placeholders
  (`"N/A"`, generic amenities, one-month-rent deposit guess) rather
  than being left blank or fabricated — see RULES.md. This shows up as
  `"N/A"` on several real, currently-live listings; that's intentional,
  not a bug, until the owner supplies real values.

## Admin panel

- **Admin CRUD UI deliberately mirrors the owner's other project** (an
  e-commerce site's admin dashboard: stat cards → tabs → data table →
  modal add/edit form with inline photo upload), per explicit request
  ("can you do the admin control section like what you have did with
  the Ecomm website?"). Colors were adapted to this project's own
  accent/stone tokens rather than copied literally — match the
  *structure/interaction pattern*, not the reference's palette.
- **Two early admin sections — "Owner Photo" and "Connect Builders
  Gallery"** (standalone Storage-upload widgets, predating the listings
  CRUD) were removed once the new per-listing photo upload replaced
  their purpose and nothing on the public site displayed them anymore.
  If something like this shows up again (an admin widget nothing public
  reads from), that's a sign it's orphaned, not a sign to keep it "in
  case."
- **No public admin signup**, by design — see RULES.md. The original
  ask did mention "login/signup," but a self-serve signup form for an
  admin account is a real security hole; account creation stayed manual
  via the Supabase dashboard instead.
- **15-minute inactivity auto-logout, applied site-wide** (not just on
  `/admin`), specifically because the admin can now navigate off to
  public pages via the "Admin Panel" ↔ regular browsing flow — an idle
  session left on `/listings` needs to time out just as much as one
  left on `/admin`.

## Process notes

- This project has, several times, had a large chunk of static data
  swapped out in one request (e.g. "replace all 8 rent listings with
  these 3 real flats"). Each time, the real cost wasn't the data edit —
  it was the ripple into every test file that depended on the old
  sample data's specific values (area names, property-type diversity,
  bed counts). Expect that ripple again if the data model or seed
  content changes meaningfully; budget for it rather than being
  surprised by it.
