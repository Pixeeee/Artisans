# ArtisanS Security Threat Model

## Assets That Matter
- Supabase service role key and database credentials.
- Private digital originals in Supabase Storage.
- Buyer and artist identity, wallet addresses, and order history.
- Stellar payment transaction hashes and certificate references.
- Admin moderation and verification privileges.

## Trust Boundaries
- Browser/mobile clients are untrusted.
- Supabase RLS is the primary database boundary.
- Next.js Route Handlers are the server validation boundary.
- Stellar Horizon/RPC is the payment evidence boundary.
- Public certificate pages can be cached, private downloads cannot.

## Attacker-Controlled Inputs
- Signup/profile fields.
- Artwork metadata, descriptions, uploads, and file names.
- Order messages and attachments.
- Shipping quote fields.
- Stellar transaction hashes and wallet addresses submitted for verification.
- Public route params and API JSON bodies.

## Required Invariants
- Service role key is never imported by client or mobile code.
- Private digital originals are only exposed through short-lived, server-authorized signed URLs after confirmed payment.
- Payment confirmation checks network, source, destination, asset issuer, amount, memo/order reference, and duplicate transaction use.
- Artists can only mutate their own listings, artworks, and seller-side order data.
- Buyers and artists can only read/write conversations for orders where they participate.
- Physical art cannot move to shipping/fulfillment before payment is confirmed.

## Highest-Risk Failure Modes
- Digital original file leak through public bucket or weak signed URL logic.
- Marking a payment confirmed by transaction hash existence only.
- RLS gaps exposing orders/messages across users.
- Service role key bundled into the browser/mobile app.
- Upload abuse through oversized or unsafe files.
- Admin verification/moderation actions without auditability.
