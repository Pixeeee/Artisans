import {
  createPaymentIntent,
  demoOrders,
  validatePaymentConfirmation,
  type StellarPaymentConfirmation,
} from "@artisans/shared";
import { badRequest, ok } from "@/lib/api-response";
import { getStellarPaymentConfig } from "@/lib/stellar/config";

const usedTransactionHashes = new Set<string>();

export async function POST(request: Request) {
  const confirmation = (await request.json().catch(() => null)) as StellarPaymentConfirmation | null;
  const order = demoOrders.find((entry) => entry.id === confirmation?.orderId);

  if (!confirmation || !order) {
    return badRequest(["Payment confirmation payload or order is invalid."]);
  }

  const intent = createPaymentIntent({
    orderId: order.id,
    sourceWallet: confirmation.sourceWallet,
    totalUsdc: order.totalUsdc,
    config: getStellarPaymentConfig(),
  });

  const result = validatePaymentConfirmation({ confirmation, intent, usedTransactionHashes });

  if (!result.ok) {
    return badRequest(result.errors, 422);
  }

  usedTransactionHashes.add(confirmation.transactionHash);

  return ok({
    payment: {
      orderId: order.id,
      status: "submitted",
      transactionHash: confirmation.transactionHash,
      nextCheck: "Backend should verify the transaction with Horizon before marking confirmed.",
    },
  });
}
