import type { StellarPaymentConfirmation, StellarPaymentIntent } from "./types";

export interface PaymentConfig {
  network: "testnet" | "mainnet";
  assetIssuer: string;
  treasuryWallet: string;
  platformFeeBps: number;
}

export function calculatePlatformFee(amountUsdc: number, platformFeeBps: number) {
  return Number(((amountUsdc * platformFeeBps) / 10_000).toFixed(2));
}

export function buildPaymentMemo(orderId: string) {
  return `ARTISANS:${orderId}`.slice(0, 28);
}

export function createPaymentIntent(input: {
  orderId: string;
  sourceWallet: string;
  totalUsdc: number;
  config: PaymentConfig;
  now?: Date;
}): StellarPaymentIntent {
  const expiresAt = new Date((input.now ?? new Date()).getTime() + 15 * 60 * 1000);
  const amountUsdc = input.totalUsdc.toFixed(2);
  const memo = buildPaymentMemo(input.orderId);
  const sep7Url = new URL("web+stellar:pay");
  sep7Url.searchParams.set("destination", input.config.treasuryWallet);
  sep7Url.searchParams.set("amount", amountUsdc);
  sep7Url.searchParams.set("asset_code", "USDC");
  sep7Url.searchParams.set("asset_issuer", input.config.assetIssuer);
  sep7Url.searchParams.set("memo", memo);
  sep7Url.searchParams.set("memo_type", "MEMO_TEXT");

  return {
    orderId: input.orderId,
    sourceWallet: input.sourceWallet,
    destinationWallet: input.config.treasuryWallet,
    amountUsdc,
    assetCode: "USDC",
    assetIssuer: input.config.assetIssuer,
    network: input.config.network,
    memo,
    sep7Url: sep7Url.toString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export function validatePaymentConfirmation(input: {
  confirmation: StellarPaymentConfirmation;
  intent: StellarPaymentIntent;
  usedTransactionHashes?: Set<string>;
}) {
  const errors: string[] = [];
  const { confirmation, intent, usedTransactionHashes } = input;

  if (usedTransactionHashes?.has(confirmation.transactionHash)) {
    errors.push("Transaction hash was already used for another payment.");
  }

  if (confirmation.network !== intent.network) errors.push("Stellar network mismatch.");
  if (confirmation.sourceWallet !== intent.sourceWallet) errors.push("Source wallet mismatch.");
  if (confirmation.expectedDestination !== intent.destinationWallet) errors.push("Destination wallet mismatch.");
  if (confirmation.expectedAmountUsdc !== intent.amountUsdc) errors.push("USDC amount mismatch.");
  if (confirmation.expectedAssetCode !== intent.assetCode) errors.push("Asset code mismatch.");
  if (confirmation.expectedAssetIssuer !== intent.assetIssuer) errors.push("Asset issuer mismatch.");
  if (confirmation.expectedMemo !== intent.memo) errors.push("Order memo mismatch.");

  return {
    ok: errors.length === 0,
    errors,
  };
}
