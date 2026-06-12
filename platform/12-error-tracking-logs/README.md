# 12 Error Tracking & Logs

## Owns
- Sentry integration.
- Structured logs.
- Audit events for security-sensitive actions.

## Production Requirements
- Never log secrets, private keys, raw auth tokens, or full service role values.
- Log stable IDs for artwork, order, payment, certificate, wallet, and user.
- Log wallet login, logout, profile update, payment confirmation, and admin verification events.

## Relevant Variables
- `SENTRY_DSN`
