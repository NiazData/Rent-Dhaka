-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Creates the "site-images" Storage bucket used for listing photos (public
-- read so the site can display them) and RLS policies so only signed-in
-- admins can upload/replace/delete objects in it. Safe to re-run.

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read site-images" on storage.objects;
create policy "Public can read site-images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-images');

drop policy if exists "Authenticated users can upload to site-images" on storage.objects;
create policy "Authenticated users can upload to site-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images');

drop policy if exists "Authenticated users can update site-images" on storage.objects;
create policy "Authenticated users can update site-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images')
  with check (bucket_id = 'site-images');

drop policy if exists "Authenticated users can delete site-images" on storage.objects;
create policy "Authenticated users can delete site-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images');
