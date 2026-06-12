export type UserRole = "buyer" | "artist" | "admin";
export type ArtworkType = "digital" | "physical";
export type ArtworkStatus = "draft" | "published" | "sold" | "archived";
export type CertificateStatus = "pending" | "issued" | "failed";
export type OrderStatus =
  | "pending"
  | "awaiting_shipping_quote"
  | "awaiting_payment"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "disputed";
export type PaymentStatus =
  | "pending"
  | "requires_wallet_signature"
  | "submitted"
  | "confirmed"
  | "failed"
  | "expired"
  | "refunded";

export interface ArtistProfile {
  id: string;
  userId: string;
  displayName: string;
  username: string;
  bio: string;
  location: string;
  verificationStatus: "unverified" | "pending" | "verified";
  payoutWalletAddress: string;
  reputationScore: number;
}

export interface Artwork {
  id: string;
  artistId: string;
  title: string;
  description: string;
  artType: ArtworkType;
  category: string;
  previewPath: string;
  originalFilePath?: string;
  metadataHash: string;
  signatureMode: "embedded" | "certificate" | "both";
  status: ArtworkStatus;
  priceUsdc: number;
  availability: "available" | "reserved" | "sold";
  editionTotal?: number;
  editionNumber?: number;
  dimensions?: string;
  medium?: string;
}

export interface Certificate {
  id: string;
  artworkId: string;
  artistWalletAddress: string;
  metadataHash: string;
  stellarTransactionHash: string;
  sorobanContractId?: string;
  network: "testnet" | "mainnet";
  status: CertificateStatus;
  issuedAt: string;
}

export interface MarketplaceOrder {
  id: string;
  buyerId: string;
  artistId: string;
  artworkId: string;
  listingId: string;
  orderType: ArtworkType;
  status: OrderStatus;
  subtotalUsdc: number;
  shippingUsdc: number;
  totalUsdc: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface ShippingQuote {
  id: string;
  orderId: string;
  artistId: string;
  buyerId: string;
  amountUsdc: number;
  method: string;
  originCountry: string;
  destinationCountry: string;
  expiresAt: string;
  status: "pending" | "accepted" | "rejected" | "expired";
}

export interface ConversationMessage {
  id: string;
  orderId: string;
  senderRole: "buyer" | "artist";
  body: string;
  attachmentPath?: string;
  createdAt: string;
}

export interface StellarPaymentIntent {
  orderId: string;
  sourceWallet: string;
  destinationWallet: string;
  amountUsdc: string;
  assetCode: "USDC";
  assetIssuer: string;
  network: "testnet" | "mainnet";
  memo: string;
  sep7Url: string;
  expiresAt: string;
}

export interface StellarPaymentConfirmation {
  orderId: string;
  transactionHash: string;
  sourceWallet: string;
  expectedDestination: string;
  expectedAmountUsdc: string;
  expectedAssetCode: "USDC";
  expectedAssetIssuer: string;
  expectedMemo: string;
  network: "testnet" | "mainnet";
}
