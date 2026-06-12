create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('buyer', 'artist', 'admin')),
  display_name text not null,
  username text unique not null,
  avatar_url text,
  wallet_address text,
  created_at timestamptz not null default now()
);

create table if not exists public.artist_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  bio text not null default '',
  location text,
  website_url text,
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'pending', 'verified')),
  payout_wallet_address text,
  reputation numeric not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artist_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  art_type text not null check (art_type in ('digital', 'physical')),
  category text not null,
  preview_url text not null,
  original_file_path text,
  metadata_hash text not null,
  signature_mode text not null default 'certificate' check (signature_mode in ('embedded', 'certificate', 'both')),
  status text not null default 'draft' check (status in ('draft', 'published', 'sold', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.physical_artwork_details (
  artwork_id uuid primary key references public.artworks(id) on delete cascade,
  medium text,
  width numeric,
  height numeric,
  depth numeric,
  weight numeric,
  origin_country text,
  handling_days int not null default 5
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  artist_wallet_address text not null,
  metadata_hash text not null,
  stellar_transaction_hash text,
  soroban_contract_id text,
  network text not null default 'testnet' check (network in ('testnet', 'mainnet')),
  status text not null default 'pending' check (status in ('pending', 'issued', 'failed')),
  issued_at timestamptz
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  price_usdc numeric not null check (price_usdc > 0),
  currency text not null default 'USDC',
  availability text not null default 'available' check (availability in ('available', 'reserved', 'sold')),
  license_terms text,
  edition_total int,
  edition_number int,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  artist_id uuid not null references public.artist_profiles(id) on delete restrict,
  listing_id uuid not null references public.listings(id) on delete restrict,
  artwork_id uuid not null references public.artworks(id) on delete restrict,
  order_type text not null check (order_type in ('digital', 'physical')),
  status text not null default 'pending' check (status in ('pending', 'awaiting_shipping_quote', 'awaiting_payment', 'paid', 'fulfilled', 'cancelled', 'disputed')),
  subtotal_usdc numeric not null check (subtotal_usdc >= 0),
  shipping_usdc numeric not null default 0 check (shipping_usdc >= 0),
  total_usdc numeric not null check (total_usdc >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.shipping_quotes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  artist_id uuid not null references public.artist_profiles(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  amount_usdc numeric not null check (amount_usdc >= 0),
  method text not null,
  origin_country text,
  destination_country text,
  expires_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'expired')),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  artist_id uuid not null references public.artist_profiles(id) on delete restrict,
  amount_usdc numeric not null check (amount_usdc > 0),
  platform_fee_usdc numeric not null default 0 check (platform_fee_usdc >= 0),
  stellar_transaction_hash text unique,
  source_wallet text not null,
  destination_wallet text not null,
  network text not null default 'testnet' check (network in ('testnet', 'mainnet')),
  status text not null default 'pending' check (status in ('pending', 'requires_wallet_signature', 'submitted', 'confirmed', 'failed', 'expired', 'refunded')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (order_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(body) <= 4000),
  attachment_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists artworks_artist_id_idx on public.artworks(artist_id);
create index if not exists artworks_status_type_category_idx on public.artworks(status, art_type, category);
create index if not exists listings_availability_price_idx on public.listings(availability, price_usdc);
create index if not exists orders_buyer_created_idx on public.orders(buyer_id, created_at desc);
create index if not exists orders_artist_created_idx on public.orders(artist_id, created_at desc);
create index if not exists payments_order_id_idx on public.payments(order_id);
create index if not exists payments_stellar_hash_idx on public.payments(stellar_transaction_hash);
create index if not exists certificates_artwork_id_idx on public.certificates(artwork_id);
create index if not exists certificates_stellar_hash_idx on public.certificates(stellar_transaction_hash);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.is_order_participant(order_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders o
    left join public.artist_profiles ap on ap.id = o.artist_id
    where o.id = order_uuid
      and (o.buyer_id = auth.uid() or ap.user_id = auth.uid() or public.is_admin())
  );
$$;

alter table public.profiles enable row level security;
alter table public.artist_profiles enable row level security;
alter table public.artworks enable row level security;
alter table public.physical_artwork_details enable row level security;
alter table public.certificates enable row level security;
alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.shipping_quotes enable row level security;
alter table public.payments enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;

create policy "profiles own read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "public verified artists read" on public.artist_profiles for select using (verification_status = 'verified' or user_id = auth.uid() or public.is_admin());
create policy "artists manage own profile" on public.artist_profiles for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

create policy "public published artworks read" on public.artworks for select using (status = 'published' or public.is_admin() or exists (select 1 from public.artist_profiles ap where ap.id = artist_id and ap.user_id = auth.uid()));
create policy "artists manage own artworks" on public.artworks for all using (exists (select 1 from public.artist_profiles ap where ap.id = artist_id and ap.user_id = auth.uid()) or public.is_admin()) with check (exists (select 1 from public.artist_profiles ap where ap.id = artist_id and ap.user_id = auth.uid()) or public.is_admin());

create policy "physical details follow artwork read" on public.physical_artwork_details for select using (exists (select 1 from public.artworks a where a.id = artwork_id and (a.status = 'published' or public.is_admin() or exists (select 1 from public.artist_profiles ap where ap.id = a.artist_id and ap.user_id = auth.uid()))));
create policy "artists manage physical details" on public.physical_artwork_details for all using (exists (select 1 from public.artworks a join public.artist_profiles ap on ap.id = a.artist_id where a.id = artwork_id and ap.user_id = auth.uid()) or public.is_admin()) with check (exists (select 1 from public.artworks a join public.artist_profiles ap on ap.id = a.artist_id where a.id = artwork_id and ap.user_id = auth.uid()) or public.is_admin());

create policy "public issued certificates read" on public.certificates for select using (status = 'issued' or public.is_admin() or exists (select 1 from public.artworks a join public.artist_profiles ap on ap.id = a.artist_id where a.id = artwork_id and ap.user_id = auth.uid()));
create policy "artists manage own certificates" on public.certificates for all using (exists (select 1 from public.artworks a join public.artist_profiles ap on ap.id = a.artist_id where a.id = artwork_id and ap.user_id = auth.uid()) or public.is_admin()) with check (exists (select 1 from public.artworks a join public.artist_profiles ap on ap.id = a.artist_id where a.id = artwork_id and ap.user_id = auth.uid()) or public.is_admin());

create policy "public active listings read" on public.listings for select using (availability in ('available', 'reserved') or public.is_admin() or exists (select 1 from public.artworks a join public.artist_profiles ap on ap.id = a.artist_id where a.id = artwork_id and ap.user_id = auth.uid()));
create policy "artists manage own listings" on public.listings for all using (exists (select 1 from public.artworks a join public.artist_profiles ap on ap.id = a.artist_id where a.id = artwork_id and ap.user_id = auth.uid()) or public.is_admin()) with check (exists (select 1 from public.artworks a join public.artist_profiles ap on ap.id = a.artist_id where a.id = artwork_id and ap.user_id = auth.uid()) or public.is_admin());

create policy "order participants read orders" on public.orders for select using (public.is_order_participant(id));
create policy "buyers create own orders" on public.orders for insert with check (buyer_id = auth.uid());
create policy "admins update orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());

create policy "order participants read quotes" on public.shipping_quotes for select using (public.is_order_participant(order_id));
create policy "artists create quotes for own orders" on public.shipping_quotes for insert with check (exists (select 1 from public.artist_profiles ap where ap.id = artist_id and ap.user_id = auth.uid()) and public.is_order_participant(order_id));

create policy "order participants read payments" on public.payments for select using (public.is_order_participant(order_id));
create policy "buyers create own payments" on public.payments for insert with check (buyer_id = auth.uid());
create policy "admins update payments" on public.payments for update using (public.is_admin()) with check (public.is_admin());

create policy "order participants read conversations" on public.conversations for select using (public.is_order_participant(order_id));
create policy "order participants create conversations" on public.conversations for insert with check (public.is_order_participant(order_id));

create policy "order participants read messages" on public.messages for select using (exists (select 1 from public.conversations c where c.id = conversation_id and public.is_order_participant(c.order_id)));
create policy "order participants create messages" on public.messages for insert with check (sender_id = auth.uid() and exists (select 1 from public.conversations c where c.id = conversation_id and public.is_order_participant(c.order_id)));

create policy "users create reports" on public.reports for insert with check (reporter_id = auth.uid());
create policy "admins manage reports" on public.reports for all using (public.is_admin()) with check (public.is_admin());
