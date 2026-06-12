# 01 Frontend

## Owns
- Buyer, artist, marketplace, certificate, and order screens.
- Responsive web UI in `apps/web`.
- iOS/Android UI in `apps/mobile`.
- Shared display contracts from `packages/shared`.

## Production Requirements
- Never expose secrets in `NEXT_PUBLIC_*`.
- Treat all browser storage as tamperable.
- Keep private digital originals out of frontend bundles and public assets.
- Load media through optimized CDN paths with reduced-motion fallbacks.

## Relevant Files
- `apps/web/src/app`
- `apps/web/src/components`
- `apps/mobile/app`
- `apps/mobile/src`
- `packages/shared/src/types.ts`
