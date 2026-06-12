alter table public.profiles
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists profiles_username_lower_unique
  on public.profiles (lower(username));

alter table public.profiles
  add constraint profiles_username_format_check
  check (username ~ '^[a-z0-9_]{3,24}$')
  not valid;

alter table public.profiles
  validate constraint profiles_username_format_check;

create or replace view public.safe_public_profiles
as
select
  id,
  username,
  display_name,
  wallet_address,
  avatar_url,
  created_at
from public.profiles;

grant select on public.safe_public_profiles to anon, authenticated;
