# ArtisanS

Stellar-powered marketplace for verified digital and physical art, using public authenticity certificates and USDC payment flows.

## Problem

Independent artists need a safer way to sell digital and physical work online without losing proof of authorship, buyer trust, or control over fulfillment. Buyers need a simple way to check whether an artwork is connected to the real creator before paying.

In the Philippines and similar creator markets, many artists sell through social media messages, manual payment screenshots, and informal shipping coordination. ArtisanS gives those artists a more structured marketplace: public proof, buyer profiles, direct order records, and payment flows designed around Stellar testnet first.

## How It Works

Artists connect a wallet, complete their profile, and create listings for digital or physical artwork. Each artwork is designed to receive an ArtisanS certificate containing the artist wallet, artwork metadata hash, timestamp, and Stellar reference.

Buyers browse artists as collections, inspect artwork details and certificate status, then either add art to their cart or start a buy/quote intent. Digital purchases unlock the original file after confirmed payment. Physical purchases support custom shipping quote conversations before final payment and fulfillment.

The current MVP is a production-shaped shell with local demo data and browser-persisted wallet/profile/cart state. Supabase migrations, RLS policy structure, Stellar payment intent routes, and certificate verification endpoints are included for the backend rollout.

## How It Uses Stellar

ArtisanS uses Stellar as a core product layer, not as cosmetic branding:

- **Network:** Stellar Testnet by default.
- **Payments:** USDC-denominated checkout flow for artwork and shipping totals.
- **Wallets:** Freighter wallet support for Stellar public-key login, plus MetaMask support in the current MVP identity shell.
- **Certificates:** Artwork authenticity certificates store creator wallet, metadata hash, timestamp, network, and Stellar transaction/reference fields.
- **Verification:** Public certificate pages and API verification endpoints are designed to verify metadata hash, artist wallet, network, and Stellar reference.
- **SEP-7-style handoff:** Payment intent helpers build Stellar payment intent data suitable for wallet handoff and later transaction-hash confirmation.

The MVP does not mint transferable NFT ownership yet. The first blockchain model is authenticity proof plus payment evidence.

## Track

Track 3 DeFi, Stablecoins & Real-World Assets

ArtisanS connects USDC payments with real-world and digital art commerce. Physical artwork listings behave like real-world assets with shipping, proof, and fulfillment records.

## Tech Stack

- Monorepo: npm workspaces
- Web: Next.js App Router, React, TypeScript, Tailwind CSS
- Mobile: Expo Router, React Native
- Shared package: TypeScript domain types, validators, mock seed data, payment/certificate helpers
- Backend plan: Supabase Auth, Postgres, Storage, RLS migrations
- Stellar SDK: `@stellar/stellar-sdk` `^13.0.0`
- Wallets: Freighter browser wallet support, MetaMask MVP wallet identity support
- Network: Stellar Testnet
- Styling and UI: Tailwind CSS, lucide-react, Framer Motion

## Setup & Run

Prerequisites:

- Node.js 20 or newer
- npm
- Optional: Freighter browser extension for Stellar wallet testing
- Optional: Supabase project credentials for backend integration

```bash
git clone [your-public-repo-url]
cd Artisans
npm install
```

Create environment variables from the example file:

```bash
cp .env.example .env.local
```

Required or planned environment variables:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_USDC_ASSET_CODE=USDC
STELLAR_USDC_ISSUER=
ARTISANS_TREASURY_WALLET=
ARTISANS_PLATFORM_FEE_BPS=500
SENTRY_DSN=
```

Run the web app:

```bash
npm run dev:web -- --hostname 127.0.0.1 --port 3000
```

Open:

```txt
http://127.0.0.1:3000
```

Run the mobile app:

```bash
npm run dev:mobile
```

Verify the project:

```bash
npm test
npm run typecheck
npm run build
```

## Network Details

- Network: Stellar Testnet
- Horizon URL: `https://horizon-testnet.stellar.org`
- Soroban RPC URL: `https://soroban-testnet.stellar.org`
- Contract IDs: N/A for current MVP shell
- Asset: USDC
- Asset issuer: set through `STELLAR_USDC_ISSUER`
- Treasury wallet: set through `ARTISANS_TREASURY_WALLET`

## Repository Structure

```txt
apps/
  web/        Next.js web marketplace
  mobile/     Expo iOS/Android app
packages/
  shared/     Shared types, seed data, validators, payment and certificate helpers
supabase/
  migrations/ Database tables, indexes, RLS, and public profile privacy view
docs/         Architecture, deployment, security, submission docs
platform/     Production layer map from frontend through recovery
assets/       Brand, icon, video, and image source assets
```

## Current MVP Features

- Artist and buyer profile setup
- Persistent profile details across wallet disconnect/reconnect
- Freighter wallet connection support
- MetaMask MVP identity connection support
- Marketplace where artists behave as collections
- Artwork detail and certificate pages
- Add-to-cart and buy/quote intent flow into buyer dashboard
- Artist dashboard with seller checklist and listing shell
- Stellar Testnet payment intent and confirmation API routes
- Supabase schema and RLS migration files
- Security headers, rate-limit placeholders, and production checklist docs

## Known Limitations

- Supabase credentials are not connected in this local MVP, so seeded demo data and browser storage are used for the first pass.
- Current certificate references are modeled in app data and API contracts; final on-chain issuance and transaction confirmation should be connected before production.
- USDC issuer and treasury wallet must be configured for a real testnet payment demo.
- Production launch still requires hosted deployment, admin moderation tools, and full server-side auth checks.

## Team

- [Your Name] - @[github-username]

## License

MIT
