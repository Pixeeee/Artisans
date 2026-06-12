# ArtisanS Deployment Runbook

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

1. Build with `npm.cmd run build -w @artisans/web`.
2. Deploy the production Next.js build to the chosen platform.
3. Verify runtime headers include:
   - `Content-Security-Policy`
   - `X-Content-Type-Options`
   - `X-Frame-Options`
   - `Referrer-Policy`
   - `Permissions-Policy`

## Mobile Release

1. Build Expo preview.
2. Verify mobile auth, payment intent display, and certificate pages against staging.
3. Promote to production channels only after web/API staging passes.

## Rollback

- Web: redeploy the previous successful build.
- Supabase: prefer forward-fix migrations; only rollback with tested reversal scripts.
- Storage: never delete private originals during rollback.
