# 05 Hosting & Deployment

## Owns
- Web deployment.
- Mobile release path.
- Environment variable management.
- Domain and TLS configuration.

## Production Requirements
- Deploy `next build` output, never `next dev`.
- Keep service role keys only in server runtime environment variables.
- Configure HTTPS, domain, preview, staging, and production environments separately.
- Disable public source maps unless uploaded privately to error tracking.

## Relevant Files
- `.env.example`
- `apps/web/next.config.ts`
- `apps/mobile/app.json`
