# ArtisanS Production Architecture

## 1. Product Goal

ArtisanS is a marketplace for digital and physical art where artists sell directly to buyers. Stellar powers two core trust layers:

- USDC payments on Stellar.
- Artwork authenticity certificates that prove creator, timestamp, artwork hash, and certificate transaction reference.

The product should feel mainstream-first. Buyers and artists should not need deep blockchain knowledge to use it.

## 2. Production Stack

### Frontend
- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui-style component system if UI primitives are added.
- Server Components for marketplace/catalog pages.
- Client Components only for wallet connection, upload progress, checkout, chat, and interactive dashboards.

### Backend
- Next.js Route Handlers for API endpoints, webhooks, payment callbacks, upload signing, and Stellar transaction submission helpers.
- Server Actions for authenticated dashboard mutations.
- Background jobs for payment reconciliation, certificate verification, notifications, and order timeout checks.

### Database, Auth, and Storage
- Supabase Postgres as primary database.
- Supabase Auth for users, artist accounts, buyer accounts, and admin access.
- Supabase Storage for artwork previews, protected digital originals, artist avatars, certificates, and shipping proof files.
- Supabase Row Level Security enabled on all user-owned tables.

### Blockchain
- Stellar SDK for payments, wallet connection, transaction building, transaction verification, and account lookup.
- USDC on Stellar as the launch payment asset.
- Stellar/Soroban authenticity certificate records for artwork provenance.
- Testnet first, mainnet after private beta.

### Hosting and Infrastructure
- Vercel for Next.js hosting.
- Supabase hosted project for database/auth/storage.
- CDN through Vercel and Supabase public asset delivery.
- Optional queue/worker layer later for heavier background jobs.

## 3. System Layers

### Layer 1: Frontend
Primary surfaces:
- Public landing page.
- Marketplace browse/search.
- Artwork detail page.
- Public certificate page.
- Buyer dashboard.
- Artist dashboard.
- Upload/listing flow.
- Order conversation.
- Checkout.
- Admin dashboard.

Frontend rules:
- Public marketplace pages are optimized for fast loading and SEO.
- Authenticated dashboards are server-rendered where possible.
- Wallet and transaction signing are client-side.
- Protected digital file downloads must always go through authenticated signed URLs or server-side authorization.

### Layer 2: APIs and Backend Logic
Core backend modules:
- Auth/session helpers.
- User profile service.
- Artist profile service.
- Artwork/listing service.
- Certificate service.
- Stellar payment service.
- Order service.
- Shipping quote service.
- Conversation/message service.
- Admin moderation service.
- Notification service.

Important API groups:
- `/api/upload/sign`
- `/api/artworks`
- `/api/orders`
- `/api/orders/:id/messages`
- `/api/orders/:id/shipping-quotes`
- `/api/payments/stellar/build`
- `/api/payments/stellar/confirm`
- `/api/certificates/:id/verify`
- `/api/admin/review`

### Layer 3: Database and Storage
Postgres is the source of truth for marketplace state. Stellar is the source of truth for blockchain payment/certificate evidence.

Storage buckets:
- `public-artwork-previews`: public preview images.
- `private-digital-originals`: protected high-resolution digital files.
- `artist-profiles`: avatars, banners, portfolio support images.
- `certificate-assets`: generated QR codes and certificate images.
- `order-attachments`: message attachments, packaging photos, delivery proof.

### Layer 4: Auth and Permissions
User roles:
- `buyer`
- `artist`
- `admin`

Permission principles:
- Buyers can read public listings and their own orders.
- Artists can manage their own profile, artworks, listings, and seller-side order records.
- Buyers and artists can only read/write messages in orders where they are participants.
- Admins can review reports, moderate listings, verify artists, and handle disputes.
- Service-role access is restricted to server-only code and never exposed to the browser.

### Layer 5: Hosting and Deployment
Environments:
- `local`: local development.
- `preview`: branch deployments and Supabase staging.
- `production`: public launch.

Deployment flow:
- Pull request opens preview deploy.
- CI runs typecheck, lint, tests, and database migration checks.
- Main branch deploys to production after checks pass.
- Supabase migrations are versioned and applied intentionally.

### Layer 6: Cloud and Compute
Initial version can use Next.js serverless functions. Add dedicated workers when needed for:
- Payment reconciliation polling.
- Certificate indexing.
- Email/push notification retries.
- Duplicate artwork scans.
- Shipping timeout checks.

### Layer 7: CI/CD and Version Control
Required checks:
- TypeScript typecheck.
- ESLint.
- Unit tests.
- Integration tests for database policies and payment state transitions.
- Build check.
- Supabase migration validation.

Branch model:
- `main`: production.
- `develop`: integration branch, optional.
- feature branches for product work.

### Layer 8: Security and RLS
Security requirements:
- RLS enabled by default.
- No direct service-role key in frontend.
- Validate ownership on every mutation.
- Validate uploaded file type, size, and extension.
- Virus/malware scanning later for uploaded originals.
- Rate limit auth, upload, checkout, message, and payment endpoints.
- Store sensitive env vars only in hosting/Supabase secrets.
- Never store private Stellar keys for users.

### Layer 9: Rate Limiting
Rate-limit targets:
- Login and signup.
- Artwork upload.
- Message send.
- Payment confirmation.
- Certificate verification.
- Admin actions.

Suggested limits:
- Public reads: generous, CDN cached.
- Auth mutations: strict per user.
- Uploads: strict per artist and file size.
- Payment confirmation: strict per order to prevent polling abuse.

### Layer 10: Caching and CDN
Cache strategy:
- Public landing and marketplace category pages: cached/ISR.
- Artwork details: cached with revalidation on listing changes.
- Certificate pages: cacheable after certificate finalization.
- Dashboards/orders/messages: no public cache.
- Preview images: CDN cache.
- Digital originals: never public cache; use short-lived signed access.

### Layer 11: Load Balancing and Scaling
Launch architecture:
- Vercel handles web traffic scaling.
- Supabase handles managed Postgres.
- CDN serves static assets and public previews.

Scaling upgrades:
- Add read replicas for analytics-heavy reads.
- Add dedicated queue workers for reconciliation and notifications.
- Add search service if Postgres full-text search becomes insufficient.
- Add object storage lifecycle policies for large files.

### Layer 12: Error Tracking and Logs
Required tracking:
- Frontend errors.
- API errors.
- Payment failures.
- Stellar transaction failures.
- Upload failures.
- RLS denied events during testing.
- Background job failures.

Suggested tools:
- Sentry for app errors.
- Supabase logs for database/API/storage.
- Vercel logs for serverless/runtime.
- Structured application logs with `order_id`, `payment_id`, `artwork_id`, and `certificate_id`.

### Layer 13: Availability and Recovery
Recovery planning:
- Automated Supabase backups.
- Migration rollback plan.
- Payment reconciliation script.
- Certificate verification repair job.
- Storage backup/lifecycle policy.
- Incident runbook for failed checkout, file leak, payment mismatch, and certificate mismatch.

## 4. Database Model

### Core Tables

`profiles`
- `id uuid primary key references auth.users`
- `role text`
- `display_name text`
- `username text unique`
- `avatar_url text`
- `wallet_address text`
- `created_at timestamptz`

`artist_profiles`
- `id uuid primary key`
- `user_id uuid references profiles(id)`
- `bio text`
- `location text`
- `website_url text`
- `verification_status text`
- `payout_wallet_address text`
- `created_at timestamptz`

`artworks`
- `id uuid primary key`
- `artist_id uuid references artist_profiles(id)`
- `title text`
- `description text`
- `art_type text` (`digital` or `physical`)
- `category text`
- `preview_url text`
- `original_file_path text nullable`
- `metadata_hash text`
- `signature_mode text`
- `status text`
- `created_at timestamptz`

`physical_artwork_details`
- `artwork_id uuid primary key references artworks(id)`
- `medium text`
- `width numeric`
- `height numeric`
- `depth numeric`
- `weight numeric`
- `origin_country text`
- `handling_days int`

`certificates`
- `id uuid primary key`
- `artwork_id uuid references artworks(id)`
- `artist_wallet_address text`
- `metadata_hash text`
- `stellar_transaction_hash text`
- `soroban_contract_id text nullable`
- `network text`
- `status text`
- `issued_at timestamptz`

`listings`
- `id uuid primary key`
- `artwork_id uuid references artworks(id)`
- `price_usdc numeric`
- `currency text default 'USDC'`
- `availability text`
- `license_terms text`
- `edition_total int nullable`
- `edition_number int nullable`
- `created_at timestamptz`

`orders`
- `id uuid primary key`
- `buyer_id uuid references profiles(id)`
- `artist_id uuid references artist_profiles(id)`
- `listing_id uuid references listings(id)`
- `artwork_id uuid references artworks(id)`
- `order_type text`
- `status text`
- `subtotal_usdc numeric`
- `shipping_usdc numeric default 0`
- `total_usdc numeric`
- `created_at timestamptz`

`shipping_quotes`
- `id uuid primary key`
- `order_id uuid references orders(id)`
- `artist_id uuid references artist_profiles(id)`
- `buyer_id uuid references profiles(id)`
- `amount_usdc numeric`
- `method text`
- `origin_country text`
- `destination_country text`
- `expires_at timestamptz`
- `status text`
- `created_at timestamptz`

`payments`
- `id uuid primary key`
- `order_id uuid references orders(id)`
- `buyer_id uuid references profiles(id)`
- `artist_id uuid references artist_profiles(id)`
- `amount_usdc numeric`
- `platform_fee_usdc numeric`
- `stellar_transaction_hash text`
- `source_wallet text`
- `destination_wallet text`
- `network text`
- `status text`
- `confirmed_at timestamptz nullable`
- `created_at timestamptz`

`conversations`
- `id uuid primary key`
- `order_id uuid references orders(id)`
- `created_at timestamptz`

`messages`
- `id uuid primary key`
- `conversation_id uuid references conversations(id)`
- `sender_id uuid references profiles(id)`
- `body text`
- `attachment_path text nullable`
- `created_at timestamptz`

`reports`
- `id uuid primary key`
- `reporter_id uuid references profiles(id)`
- `artwork_id uuid references artworks(id)`
- `reason text`
- `status text`
- `created_at timestamptz`

### Indexes
Required indexes:
- `artworks(artist_id)`
- `artworks(status, art_type, category)`
- `listings(availability, price_usdc)`
- `orders(buyer_id, created_at desc)`
- `orders(artist_id, created_at desc)`
- `payments(order_id)`
- `payments(stellar_transaction_hash)`
- `certificates(artwork_id)`
- `certificates(stellar_transaction_hash)`
- `messages(conversation_id, created_at)`

## 5. Row Level Security Rules

RLS defaults:
- Public can read published artworks, active listings, verified public artist profiles, and finalized certificates.
- Authenticated users can read their own profile.
- Artists can insert/update their own artworks and listings.
- Buyers can create orders for active listings.
- Order participants can read their own orders.
- Order participants can read/write messages for their order conversation.
- Only artists can create shipping quotes for their own physical orders.
- Only admins can update report statuses, verification statuses, and moderation states.

## 6. Stellar Payment Flow

### Buyer Checkout
1. Buyer selects artwork.
2. App creates a pending order.
3. For physical art, buyer accepts shipping quote before payment.
4. Backend calculates total USDC and platform fee.
5. Frontend asks buyer to connect Stellar wallet.
6. Backend builds payment transaction details.
7. Buyer signs with wallet.
8. Transaction is submitted to Stellar.
9. Backend verifies transaction hash, source, destination, asset, amount, and memo/order reference.
10. Payment becomes `confirmed`.
11. Order becomes `paid`.
12. Digital file unlocks or physical fulfillment starts.

### Payment Statuses
- `pending`
- `requires_wallet_signature`
- `submitted`
- `confirmed`
- `failed`
- `expired`
- `refunded`

## 7. Artwork Certificate Flow

### Certificate Creation
1. Artist uploads artwork.
2. Backend creates canonical metadata JSON.
3. Backend hashes metadata and file fingerprint.
4. Backend creates certificate record in Supabase as `pending`.
5. Backend writes certificate evidence to Stellar/Soroban or submits a certificate transaction reference.
6. Backend saves Stellar transaction hash.
7. Certificate becomes `issued`.
8. Public certificate page becomes available.

### Certificate Metadata
Canonical metadata should include:
- Artwork ID.
- Artist profile ID.
- Artist wallet address.
- Artwork title.
- Art type.
- Preview file hash.
- Original file hash for digital art.
- Physical details hash for physical art.
- Created timestamp.
- ArtisanS certificate version.

Do not store private files directly on-chain. Store hashes and references.

## 8. Digital Art Fulfillment

Rules:
- Original file is private.
- Buyer can only access original after payment confirmation.
- Download access uses short-lived signed URLs.
- Every download event is logged.
- Certificate stays public, original file stays private.

## 9. Physical Art Fulfillment

Rules:
- Physical art requires shipping fee before final payment.
- Buyer and artist use order-scoped conversation.
- Artist submits shipping quote.
- Buyer accepts quote.
- Buyer pays artwork price plus shipping.
- Artist adds tracking and shipping proof.
- Buyer confirms delivery.

Future upgrade:
- Escrow and dispute system before automatic release of funds.

## 10. Suggested Repo Structure

```txt
artisans/
  src/
    app/
      (public)/
        page.tsx
        marketplace/
        artwork/[id]/
        certificate/[id]/
      (auth)/
        sign-in/
        sign-up/
      dashboard/
        buyer/
        artist/
        admin/
      api/
        artworks/
        orders/
        payments/stellar/
        certificates/
        upload/
    components/
      ui/
      layout/
      marketplace/
      artwork/
      checkout/
      dashboard/
      certificate/
    lib/
      supabase/
      stellar/
      auth/
      validators/
      permissions/
      storage/
      payments/
      certificates/
    server/
      services/
      jobs/
      repositories/
    types/
    styles/
  supabase/
    migrations/
    seed.sql
    policies/
  tests/
    unit/
    integration/
    e2e/
  docs/
    artisans-production-architecture.md
```

## 11. Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STELLAR_NETWORK`
- `NEXT_PUBLIC_STELLAR_HORIZON_URL`
- `NEXT_PUBLIC_STELLAR_RPC_URL`
- `STELLAR_USDC_ASSET_CODE`
- `STELLAR_USDC_ISSUER`
- `ARTISANS_TREASURY_WALLET`
- `ARTISANS_PLATFORM_FEE_BPS`
- `SENTRY_DSN`

Mainnet-only:
- `STELLAR_MAINNET_RPC_URL`
- `STELLAR_MAINNET_HORIZON_URL`

## 12. Testing Plan

### Unit Tests
- Metadata hash generation.
- Certificate payload canonicalization.
- Payment amount/fee calculation.
- Order state transitions.
- Permission helpers.

### Integration Tests
- Artist uploads digital art and receives pending certificate.
- Certificate becomes issued after Stellar transaction verification.
- Buyer cannot access digital original before payment.
- Buyer can access digital original after confirmed payment.
- Physical order requires accepted shipping quote before payment.
- Order participants can message each other.
- Non-participants cannot access order messages.
- RLS policies block unauthorized reads/writes.

### E2E Tests
- Artist onboarding to listing publish.
- Buyer marketplace purchase.
- Digital art unlock.
- Physical shipping quote and order conversation.
- Certificate public verification page.

## 13. Launch Milestones

### Milestone 1: Foundation
- Brand assets.
- Landing page.
- Supabase project.
- Next.js app.
- Auth.
- Core database migrations.

### Milestone 2: Marketplace MVP
- Artist dashboard.
- Artwork upload.
- Marketplace browse.
- Artwork detail page.
- Listings.
- Admin review.

### Milestone 3: Stellar Integration
- Wallet connection.
- USDC payment transaction flow.
- Payment verification.
- Certificate generation and verification.
- Public certificate page.

### Milestone 4: Fulfillment
- Digital file unlock.
- Physical shipping quotes.
- Order conversation.
- Shipping proof.

### Milestone 5: Private Beta
- Invite artists.
- Test real uploads.
- Test payments on testnet.
- Harden RLS and storage policies.
- Fix onboarding and checkout issues.

### Milestone 6: Production Launch
- Mainnet switch.
- Monitoring.
- Backups.
- Rate limits.
- Terms/policies.
- Launch campaign and brand video.

## 14. Production Readiness Checklist

- [ ] RLS enabled on every app table.
- [ ] Storage buckets have correct public/private policies.
- [ ] Service role key is server-only.
- [ ] All payment confirmations verify amount, asset, destination, source, network, and order reference.
- [ ] Digital originals cannot be accessed without paid order authorization.
- [ ] Certificate hashes are deterministic and reproducible.
- [ ] Admin actions are audited.
- [ ] API routes validate inputs.
- [ ] Upload limits are enforced.
- [ ] Rate limits exist for mutation endpoints.
- [ ] Logs include order/payment/certificate IDs.
- [ ] Supabase backups are enabled.
- [ ] Error tracking is active.
- [ ] CI passes before production deploy.
- [ ] Testnet beta is completed before mainnet launch.
