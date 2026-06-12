# ArtisanS Deployment Runbook

Primary deployment path: Vercel + Supabase + Expo EAS. See `docs/deployment-vercel-supabase-expo.md` for the full setup.

## Preflight

1. Confirm `.env.example` has matching production secrets configured in the hosting provider.
2. Confirm no `SUPABASE_SERVICE_ROLE_KEY` usage appears in client/mobile code.
3. Run:

```powershell
npm.cmd test
npm.cmd run build
```

4. Apply Supabase migrations in staging first.
5. Verify RLS policies with buyer, artist, and admin test accounts.

## Web Deploy

1. Build with `npm.cmd run deploy:web:build`.
2. Deploy `apps/web` to Vercel.
3. Verify runtime headers include:
   - `Content-Security-Policy`
   - `X-Content-Type-Options`
   - `X-Frame-Options`
   - `Referrer-Policy`
   - `Permissions-Policy`

## Mobile Release

1. Set EAS public env vars for Supabase, Stellar, and the Vercel API base URL.
2. Build Expo preview with `npm.cmd run deploy:mobile:android` or `npm.cmd run deploy:mobile:ios`.
2. Verify mobile auth, payment intent display, and certificate pages against staging.
3. Promote to production channels only after web/API staging passes.

## Rollback

- Web: redeploy the previous successful build.
- Supabase: prefer forward-fix migrations; only rollback with tested reversal scripts.
- Storage: never delete private originals during rollback.
