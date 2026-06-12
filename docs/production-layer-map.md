# ArtisanS Production Layer Map

ArtisanS follows the layered production model shown in the reference image. The working source stays in `apps`, `packages`, and `supabase`; the `platform` directory documents ownership, security controls, and launch gates for each layer.

## Folder Correlation

```txt
platform/
  01-frontend/                 -> apps/web, apps/mobile
  02-apis-backend-logic/       -> apps/web/src/app/api, apps/web/src/lib
  03-database-storage/         -> supabase/migrations, storage buckets
  04-auth-permissions/         -> Supabase Auth, wallet proof, Google OAuth
  05-hosting-deployment/       -> Next.js deployment, Expo release
  06-cloud-compute/            -> serverless, jobs, Supabase managed services
  07-cicd-version-control/     -> GitHub Actions, build/test gates
  08-security-rls/             -> RLS, ownership checks, security headers
  09-rate-limiting/            -> rate limit wrappers and edge limits
  10-caching-cdn/              -> static media, public certificate cache
  11-load-balancing-scaling/   -> horizontal scale and background work
  12-error-tracking-logs/      -> Sentry, logs, audit events
  13-availability-recovery/    -> backups, rollback, incident response
```

## Launch Rule

The app is not production-ready until every layer has:

- an owner,
- automated verification,
- environment variables documented,
- security controls enabled,
- rollback/recovery instructions,
- staging validation before production.
