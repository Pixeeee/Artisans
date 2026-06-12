# 03 Database & Storage

## Owns
- Supabase Postgres schema.
- Supabase Storage buckets.
- RLS-backed data access.
- Private digital original file storage.

## Production Requirements
- Apply all migrations before launch.
- Public previews and private originals must be separate buckets.
- Private digital originals require short-lived server-authorized signed URLs.
- Use UUIDs for exposed resource identifiers.

## Relevant Files
- `supabase/migrations`
- `supabase/seed.sql`
- `docs/production-checklist.md`
