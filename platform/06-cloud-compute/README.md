# 06 Cloud & Compute

## Owns
- Serverless/edge compute for route handlers.
- Background jobs for certificate creation, duplicate checks, and payment reconciliation.
- Supabase managed Postgres and Storage.

## Production Requirements
- Long-running payment reconciliation should move to scheduled jobs.
- Upload processing should run outside request/response if expensive.
- Duplicate-art detection should be isolated from checkout/payment paths.
