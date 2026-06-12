# StellarX Philippines Submission Issue Draft

Use this as the body of your GitHub Issue in the StellarX workshop repository.

Issue title format:

```txt
Team #[number] - ArtisanS
```

Issue body:

```markdown
## Project Name
ArtisanS

## One-Line Description
Stellar-powered marketplace for verified digital and physical art, using public authenticity certificates and USDC payment flows.

## Track
Track 3 DeFi, Stablecoins & Real-World Assets

## Problem It Solves
Independent artists need a safer way to sell digital and physical work online without losing proof of authorship, buyer trust, or control over fulfillment. Buyers need a simple way to check whether an artwork is connected to the real creator before paying.

In the Philippines and similar creator markets, many artists sell through social media messages, manual payment screenshots, and informal shipping coordination. ArtisanS gives those artists a structured marketplace for public proof, direct order records, buyer profiles, and payment flows designed around Stellar.

## How It Uses Stellar
ArtisanS uses Stellar Testnet as a core product layer for USDC-denominated payment flows and authenticity certificates. Each artwork is designed to receive an ArtisanS certificate containing creator wallet, artwork metadata hash, timestamp, network, and Stellar transaction/reference fields.

The app includes Freighter wallet support for Stellar public-key connection, Stellar payment intent helpers, certificate verification endpoints, and public certificate pages. The v1 blockchain model is authenticity proof plus payment evidence, not transferable NFT ownership.

## GitHub Repository
[Link to your public repo. Final code must be on the `main` branch.]

## Network & Deployment
- Network: testnet
- Live app URL (if any): runs locally - see README
- Contract IDs / asset issuers (if any): Contract IDs: N/A for MVP shell. USDC issuer is configured with `STELLAR_USDC_ISSUER`. Treasury wallet is configured with `ARTISANS_TREASURY_WALLET`.

## Team
- [Your Name] - @[github-username]

## Novelty Note (optional, for bonus points)
ArtisanS is not trying to be another NFT marketplace clone. The first version focuses on mainstream artist commerce: direct digital and physical artwork sales, public authenticity proof, private order history, custom shipping quote flows, and USDC payment evidence on Stellar.

The project is different from a pure collectible marketplace because physical art fulfillment, shipping quote negotiation, and artist profile trust are first-class flows. The Stellar layer starts with certificates and payments, then can expand into Soroban-backed issuance, escrow, and commercial licenses.

## Anything Else
Current MVP limitations: Supabase credentials are not connected in the local demo, so seeded demo data and browser storage are used for the first pass. Final production work should connect real Supabase Auth/RLS, configure a real testnet USDC issuer and treasury wallet, and complete on-chain certificate issuance or transaction confirmation before launch.
```

## Pre-Submission Checklist

- [ ] Push all code to a public GitHub repository
- [ ] Confirm final code is on `main`
- [ ] Fill in the public repo link in the issue draft
- [ ] Replace team placeholders with real names and GitHub usernames
- [ ] Confirm `LICENSE` is present
- [ ] Confirm README setup instructions work from a clean clone
- [ ] Configure Stellar Testnet issuer/treasury env vars for the final demo
- [ ] Run `npm test`
- [ ] Run `npm run build`
- [ ] Open the GitHub Issue before the event deadline
