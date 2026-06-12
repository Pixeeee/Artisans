# 02 APIs & Backend Logic

## Owns
- Artwork creation and listing APIs.
- Order creation and participant checks.
- Stellar payment intent and confirmation.
- Certificate verification.
- Message and shipping quote workflows.

## Production Requirements
- Validate every JSON body at runtime.
- Authenticate every state-changing request.
- Enforce ownership on the server, not only in the UI.
- Never confirm a payment by transaction-hash existence only.

## Relevant Files
- `apps/web/src/app/api`
- `apps/web/src/lib/stellar`
- `packages/shared/src/payments.ts`
- `packages/shared/src/certificates.ts`
- `packages/shared/src/validators.ts`
