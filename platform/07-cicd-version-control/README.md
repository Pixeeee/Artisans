# 07 CI/CD & Version Control

## Owns
- Automated checks before deploy.
- Build, test, and security gate commands.
- Release tagging and rollback.

## Required Gates
- `npm.cmd test`
- `npm.cmd run build`
- Dependency audit for high/critical issues.
- Supabase migration review.
- Environment variable review for public/private separation.

## Relevant Files
- `.github/workflows/ci.yml`
- `package.json`
