-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Creates the listings table, enables RLS, and seeds the 5 listings
-- currently hardcoded in src/data/listings.ts so the site keeps working
-- once the app switches to reading from this table.

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  address text not null,
  area text not null,
  rent_bdt numeric not null,
  deposit_bdt numeric not null,
  beds integer not null,
  baths integer not null,
  sqft numeric not null,
  available_from date not null,
  property_type text not null,
  listing_purpose text not null,
  pet_policy text not null,
  parking text not null,
  amenities text[] not null default '{}',
  utilities_info text not null,
  lease_terms text not null,
  photos text[] not null default '{}',
  lat double precision not null,
  lng double precision not null,
  virtual_tour_url text,
  created_at timestamptz not null default now()
);

alter table public.listings enable row level security;

create policy "Public can read listings"
  on public.listings for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can insert listings"
  on public.listings for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update listings"
  on public.listings for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete listings"
  on public.listings for delete
  to authenticated
  using (true);

insert into public.listings
  (slug, title, address, area, rent_bdt, deposit_bdt, beds, baths, sqft, available_from,
   property_type, listing_purpose, pet_policy, parking, amenities, utilities_info, lease_terms,
   photos, lat, lng)
values
  ('bosila-garden-city-flat-a',
   'Flat A : 3 Bedroom Apartment in Bosila Garden City, Mohammadpur',
   'Floor No. 3, House No. 33, Road No. 1, Block G, Bosila Garden City, Mohammadpur, Dhaka 1207',
   'Bosila, Mohammadpur', 12000, 12000, 3, 2, 1080, '2026-11-01',
   'apartment', 'rent', 'N/A', 'N/A', array['Lift', 'Generator backup'],
   'Separate utility meters', '12-month lease', array[]::text[], 23.7601, 90.3451),

  ('bosila-garden-city-flat-b',
   'Flat B : 3 Bedroom Apartment in Bosila Garden City, Mohammadpur',
   'Floor No. 3, House No. 33, Road No. 1, Block G, Bosila Garden City, Mohammadpur, Dhaka 1207',
   'Bosila, Mohammadpur', 15000, 15000, 3, 2, 1080, '2026-11-01',
   'apartment', 'rent', 'N/A', 'N/A', array['Lift', 'Generator backup'],
   'Separate utility meters', '12-month lease', array[]::text[], 23.7601, 90.3451),

  ('bosila-garden-city-flat-c',
   'Flat C : 3 Bedroom Apartment in Bosila Garden City, Mohammadpur',
   'Floor No. 3, House No. 33, Road No. 1, Block G, Bosila Garden City, Mohammadpur, Dhaka 1207',
   'Bosila, Mohammadpur', 15000, 15000, 3, 2, 1080, '2026-11-01',
   'apartment', 'rent', 'N/A', 'N/A', array['Lift', 'Generator backup'],
   'Separate utility meters', '12-month lease', array[]::text[], 23.7601, 90.3451),

  ('mohammadpur-apartment-for-sale',
   '3 Bedroom Apartment for Sale in Mohammadpur',
   'Mohammadpur, Dhaka 1207',
   'Mohammadpur', 4400000, 0, 3, 2, 1080, '2026-11-01',
   'apartment', 'sale', 'N/A', '1 covered space for an additional ৳300,000 payment',
   array['Lift', 'Generator backup'], 'Separate utility meters', 'Freehold, ready for registration',
   array['/images/sell/buy1.jpeg', '/images/sell/buy2.jpeg'], 23.7658, 90.3610),

  ('rampura-ready-apartment-builder',
   'Ready 3-Bedroom Apartment by City Builders in Rampura',
   'Central Rampura, Dhaka 1219',
   'Rampura', 8200000, 0, 3, 2, 1350, '2026-10-25',
   'apartment', 'builder', 'N/A', '1 covered space',
   array['Lift', '24/7 security', 'Generator backup'], 'Separate utility meters',
   'Ready for handover, registration assisted',
   array['/images/connect-builders/connect-builders.jpeg', '/images/connect-builders/connect-builders.jpeg'],
   23.7580, 90.4260)
on conflict (slug) do nothing;
