insert into storage.buckets (id, name, public)
values
  ('public-artwork-previews', 'public-artwork-previews', true),
  ('private-digital-originals', 'private-digital-originals', false),
  ('artist-profiles', 'artist-profiles', true),
  ('certificate-assets', 'certificate-assets', true),
  ('order-attachments', 'order-attachments', false)
on conflict (id) do update set public = excluded.public;

create policy "public artwork previews are readable"
on storage.objects for select
using (bucket_id = 'public-artwork-previews');

create policy "public artist profile assets are readable"
on storage.objects for select
using (bucket_id = 'artist-profiles');

create policy "public certificate assets are readable"
on storage.objects for select
using (bucket_id = 'certificate-assets');

create policy "authenticated users upload previews"
on storage.objects for insert
with check (bucket_id = 'public-artwork-previews' and auth.uid() is not null);

create policy "authenticated users upload private originals"
on storage.objects for insert
with check (bucket_id = 'private-digital-originals' and auth.uid() is not null);

create policy "authenticated users upload order attachments"
on storage.objects for insert
with check (bucket_id = 'order-attachments' and auth.uid() is not null);
