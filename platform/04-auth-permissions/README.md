# 04 Auth & Permissions

## Owns
- Supabase Auth.
- Google OAuth verification for Gmail accounts.
- Wallet ownership proof.
- Buyer, artist, admin roles.

## Production Requirements
- Replace browser-only wallet sessions with signed nonce wallet login.
- Link wallet identity to Supabase user IDs.
- Require Google OAuth before trusted email actions.
- Authorize every profile, order, listing, and message action by role and ownership.

## Current MVP
- `apps/web/src/lib/wallet-session.ts` stores only temporary public wallet data.
- `apps/web/src/lib/profile-session.ts` stores temporary profile data bound to the active wallet.

These are not production authorization boundaries.
