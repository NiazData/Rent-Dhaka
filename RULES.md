# Rules — Iman Homes

Working rules distilled from this project's history. Follow these
without being re-told; they encode corrections the project owner has
already given once.

## Data integrity

- **Never fabricate specific facts about a listing** (pet policy,
  parking, amenities, deposit amount, availability date) that the owner
  didn't give you. For required-but-unspecified fields, use a neutral
  placeholder (`"N/A"`, a generic `["Lift", "Generator backup"]`
  amenities default, a one-month-rent deposit guess) and **say out
  loud** that you defaulted it, so the owner can correct it. This is
  different from inventing a claim — a neutral placeholder is flagged
  and reversible; a fabricated specific fact is not.
- **Never substitute stock/AI-generated photography** for a missing
  real photo. Show the no-photo placeholder (see DESIGN-SYSTEM.md)
  instead. This was a direct, repeated instruction.
- If asked to revert or simplify one named thing, **change only that
  thing.** Don't bundle in adjacent "while I'm here" edits to structure
  or decoration — a scope creep complaint has already happened once on
  this project.

## Git

- Never `git add -A` / `git add .`. Stage the exact files you changed.
- Exclude the owner's personal working files from commits
  (`Changes.docx`, `~$hanges.docx`, anything under `pictures/` — the
  last one is gitignored already as a local staging folder for images).
- New commits, never `--amend`, unless explicitly asked.
- End commit messages with the `Co-Authored-By: Claude Sonnet 5
  <noreply@anthropic.com>` trailer.
- Run the full test suite **and** `npm run build` clean before every
  commit — both, not just one.

## Deploy

- Default posture: implement → test → build → show on `localhost`
  (`npm run dev`) → wait for explicit go-ahead → `git push` →
  `netlify deploy --prod --dir=dist`. Don't skip the local-review step
  for anything with visible UI/content changes.
- Exception: a live bug the owner just hit in production (e.g. a
  broken public page, a failed upload) can be fixed and shipped
  straight through without an extra local-review round — the bug
  itself is already their confirmation something needs to change
  immediately.
- Database/Storage changes (anything under `supabase/migrations/`)
  **cannot be run by the agent** — there is no service-role key or DB
  connection available in this environment. Write the migration SQL,
  hand it to the owner to run in the Supabase SQL Editor, and verify
  the result afterward with a REST call using the anon key (see
  ARCHITECTURE.md's deploy section) rather than assuming it worked.

## Admin account model

- **There is no public admin signup page, and none should be added**
  without explicit direction. New admin accounts are created manually
  by the owner via the Supabase dashboard (Authentication → Users).
  A self-serve signup form would let anyone create an admin account.

## Testing

- Mock `../lib/supabase`, not `../lib/listings-repository`, so the real
  filter/sort logic in the repository runs against the fake table
  instead of being re-implemented (and potentially drifting) inside
  test mocks. Use `createFakeListingsSupabase` +
  `src/test/listingFixtures.ts` (see ARCHITECTURE.md).
- Every listings-backed page is async now — use `findBy*`/`waitFor`
  around the initial fetch, not a bare synchronous `getBy*` right after
  `render()`.
- When a UI text query could match more than one thing on a page
  (e.g. a place name appearing in both a paragraph and an address
  block), switch to `getAllByText(...).length` instead of fighting the
  ambiguity with increasingly specific regex.

## When something is ambiguous

- A request that implies a real, scoped product decision (which data
  stays vs. which gets deleted, how to treat orphaned admin features)
  gets a short, concrete question — not a guess, and not a long
  brainstorming process either. This project moves by direct
  implementation; match that pace, don't add ceremony it hasn't asked
  for.
