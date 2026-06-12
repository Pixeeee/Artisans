# ArtisanS Production Checklist

- RLS enabled on every app table.
- Storage buckets have public/private policies matching asset sensitivity.
- Service role key is server-only.
- Payment confirmation verifies full Stellar transaction details.
- Digital originals require confirmed payment authorization.
- Certificate hashes are deterministic and reproducible.
- API routes validate inputs and ownership.
- Upload size, type, and extension limits are enforced.
- Rate limits protect auth, upload, message, checkout, and payment endpoints.
- Logs include order, payment, artwork, and certificate IDs.
- Supabase backups are enabled before private beta.
- Error tracking is configured before production.
- Testnet beta is completed before mainnet launch.
