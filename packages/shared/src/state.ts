import type { ArtworkType, OrderStatus, PaymentStatus } from "./types";

export function getInitialOrderStatus(artType: ArtworkType): OrderStatus {
  return artType === "physical" ? "awaiting_shipping_quote" : "awaiting_payment";
}

export function canUnlockDigitalFile(input: {
  orderType: ArtworkType;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}) {
  return (
    input.orderType === "digital" &&
    input.orderStatus === "paid" &&
    input.paymentStatus === "confirmed"
  );
}

export function canShipPhysicalOrder(input: {
  orderType: ArtworkType;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}) {
  return (
    input.orderType === "physical" &&
    (input.orderStatus === "paid" || input.orderStatus === "fulfilled") &&
    input.paymentStatus === "confirmed"
  );
}
