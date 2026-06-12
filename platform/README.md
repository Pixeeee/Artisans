# ArtisanS Production Layer Map

This directory maps ArtisanS to the production stack in the reference image. It is not a replacement for the working app folders. It is the operating model that explains where each layer lives, what it owns, and what must be true before launch.

## Layer Order

| Layer | Folder | Current implementation |
| --- | --- | --- |
| Frontend | `01-frontend` | `apps/web`, `apps/mobile`, `packages/shared` UI contracts |
| APIs & Backend Logic | `02-apis-backend-logic` | Next.js route handlers under `apps/web/src/app/api` |
| Database & Storage | `03-database-storage` | `supabase/migrations`, Supabase Storage bucket policies |
| Auth & Permissions | `04-auth-permissions` | Wallet/profile MVP session now, Supabase Auth + Google OAuth next |
| Hosting & Deployment | `05-hosting-deployment` | Next.js deployment target, Expo/EAS mobile path |
| Cloud & Compute | `06-cloud-compute` | Vercel/Netlify serverless or container runtime, Supabase managed services |
| CI/CD & Version Control | `07-cicd-version-control` | GitHub Actions workflow scaffold |
| Security & RLS | `08-security-rls` | Supabase RLS, security headers, server-only service role |
| Rate Limiting | `09-rate-limiting` | `apps/web/src/lib/rate-limit.ts`, endpoint wrappers |
| Caching & CDN | `10-caching-cdn` | Static media/CDN, public certificate caching, private file no-store |
| Load Balancing & Scaling | `11-load-balancing-scaling` | Managed platform horizontal scale plan |
| Error Tracking & Logs | `12-error-tracking-logs` | Sentry placeholder, structured log requirements |
| Availability & Recovery | `13-availability-recovery` | Backup, rollback, runbook, recovery targets |

## Security Position

The current app is a production-shaped MVP. It is not yet a fully launched secure system because wallet auth, Google verification, upload authorization, private digital file delivery, and Supabase-backed multi-user profiles still need to move from browser session state into server-backed Supabase Auth, RLS, and audited API routes.

Do not treat browser session data as an authorization boundary. It is only a local MVP convenience.
