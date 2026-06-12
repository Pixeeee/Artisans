# 09 Rate Limiting

## Owns
- Abuse control for auth, uploads, messages, checkout, and payment confirmation.

## Production Requirements
- Replace in-memory limits with Redis, Upstash, Supabase-backed counters, or platform edge rate limiting.
- Rate-limit by user ID, wallet, IP, and action where appropriate.
- Use stricter limits for payment confirmation and login attempts.

## Relevant Files
- `apps/web/src/lib/rate-limit.ts`
