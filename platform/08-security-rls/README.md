# 08 Security & RLS

## Owns
- Supabase RLS policies.
- Server-side ownership checks.
- Security headers.
- Admin and moderation boundaries.

## Production Requirements
- RLS enabled on every app table.
- API checks must mirror RLS checks.
- Service role key must never be imported by client or mobile code.
- Certificate and payment verification must be deterministic and auditable.

## Relevant Files
- `supabase/migrations`
- `apps/web/next.config.ts`
- `docs/security-threat-model.md`
