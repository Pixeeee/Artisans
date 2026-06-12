# 10 Caching & CDN

## Owns
- Static asset caching.
- Public certificate page caching.
- Marketplace browsing cache strategy.

## Production Requirements
- Public previews can be CDN cached.
- Public certificate pages can be cached after issuance.
- Private digital originals must use `Cache-Control: no-store` and short-lived signed URLs.
- Payment, profile, order, and message APIs must not be publicly cached.
