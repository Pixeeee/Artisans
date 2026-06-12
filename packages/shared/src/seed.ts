import type {
  ArtistProfile,
  Artwork,
  Certificate,
  ConversationMessage,
  MarketplaceOrder,
  ShippingQuote,
} from "./types";

export const demoArtists: ArtistProfile[] = [
  {
    id: "artist-mara",
    userId: "profile-mara",
    displayName: "Mara Velasquez",
    username: "mara-velasquez",
    bio: "Painter and digital collage artist exploring memory, texture, and luminous domestic scenes.",
    location: "Manila, Philippines",
    verificationStatus: "verified",
    payoutWalletAddress: "GARTISANSTESTMARA7PLATFORMPUBLICKEY000000001",
    reputationScore: 98,
  },
  {
    id: "artist-eli",
    userId: "profile-eli",
    displayName: "Eli Tan",
    username: "eli-tan",
    bio: "Physical canvas work and mixed media focused on architectural color fields.",
    location: "Taipei, Taiwan",
    verificationStatus: "pending",
    payoutWalletAddress: "GARTISANSTESTELI7PLATFORMPUBLICKEY0000000002",
    reputationScore: 91,
  },
];

export const demoArtworks: Artwork[] = [
  {
    id: "art-digital-aurora",
    artistId: "artist-mara",
    title: "Aurora Study",
    description: "A high-resolution digital work with layered brush textures and certificate-only signature.",
    artType: "digital",
    category: "Digital Painting",
    previewPath: "/assets/digitalarts/1.jpg",
    originalFilePath: "private-digital-originals/art-digital-aurora.tif",
    metadataHash: "sha256:f674f12a8bb59d02c2bd7172e02f73a933deef5890b42b51e6b4e25bda758101",
    signatureMode: "certificate",
    status: "published",
    priceUsdc: 120,
    availability: "available",
    editionTotal: 25,
    editionNumber: 1,
  },
  {
    id: "art-digital-celestial",
    artistId: "artist-mara",
    title: "Celestial Archive",
    description: "Digital collage with embedded artist mark and public Stellar authenticity reference.",
    artType: "digital",
    category: "Digital Collage",
    previewPath: "/assets/digitalarts/aeb3f958718b496e2f1d36e1dbee4231.jpg",
    originalFilePath: "private-digital-originals/art-digital-celestial.png",
    metadataHash: "sha256:da06fd2b3668b8f037ad47855418816bc5e99cb8e1b2ee9c744aa66f0f24af09",
    signatureMode: "both",
    status: "published",
    priceUsdc: 85,
    availability: "available",
    editionTotal: 10,
    editionNumber: 3,
  },
  {
    id: "art-physical-window",
    artistId: "artist-eli",
    title: "Window Plane No. 4",
    description: "Acrylic on canvas. Buyer and artist agree shipping fee before final USDC payment.",
    artType: "physical",
    category: "Acrylic",
    previewPath: "/assets/actualarts/a8cb142b1e7d7a88a8e13a6714bb816b.jpg",
    metadataHash: "sha256:371aa79c178cd91357dcbab8b75dbd8478e5b8e127f445cc774614c140bcb56f",
    signatureMode: "embedded",
    status: "published",
    priceUsdc: 420,
    availability: "available",
    dimensions: "60 x 80 cm",
    medium: "Acrylic on canvas",
  },
  {
    id: "art-physical-terracotta",
    artistId: "artist-eli",
    title: "Terracotta Signal",
    description: "Mixed media physical artwork with QR-ready ArtisanS certificate.",
    artType: "physical",
    category: "Mixed Media",
    previewPath: "/assets/actualarts/82173fc8a0a42b32f6e39d4ebbf2d31a.jpg",
    metadataHash: "sha256:481d7fb7eb128b2bfabfbf7c33ed5ae62ab496d66edb58d4a46ed22c8a145352",
    signatureMode: "both",
    status: "published",
    priceUsdc: 680,
    availability: "reserved",
    dimensions: "72 x 92 cm",
    medium: "Mixed media on panel",
  },
];

export const demoCertificates: Certificate[] = demoArtworks.map((artwork, index) => ({
  id: `cert-${artwork.id}`,
  artworkId: artwork.id,
  artistWalletAddress:
    demoArtists.find((artist) => artist.id === artwork.artistId)?.payoutWalletAddress ?? "",
  metadataHash: artwork.metadataHash,
  stellarTransactionHash: `testnet-cert-tx-${String(index + 1).padStart(4, "0")}`,
  network: "testnet",
  status: "issued",
  issuedAt: new Date(Date.UTC(2026, 4, 26, 0, index, 0)).toISOString(),
}));

export const demoOrders: MarketplaceOrder[] = [
  {
    id: "order-digital-001",
    buyerId: "buyer-demo",
    artistId: "artist-mara",
    artworkId: "art-digital-aurora",
    listingId: "listing-art-digital-aurora",
    orderType: "digital",
    status: "paid",
    subtotalUsdc: 120,
    shippingUsdc: 0,
    totalUsdc: 120,
    paymentStatus: "confirmed",
    createdAt: "2026-05-26T01:00:00.000Z",
  },
  {
    id: "order-physical-001",
    buyerId: "buyer-demo",
    artistId: "artist-eli",
    artworkId: "art-physical-window",
    listingId: "listing-art-physical-window",
    orderType: "physical",
    status: "awaiting_payment",
    subtotalUsdc: 420,
    shippingUsdc: 38,
    totalUsdc: 458,
    paymentStatus: "pending",
    createdAt: "2026-05-26T02:00:00.000Z",
  },
];

export const demoShippingQuotes: ShippingQuote[] = [
  {
    id: "quote-physical-001",
    orderId: "order-physical-001",
    artistId: "artist-eli",
    buyerId: "buyer-demo",
    amountUsdc: 38,
    method: "DHL tracked international",
    originCountry: "Taiwan",
    destinationCountry: "Philippines",
    expiresAt: "2026-06-02T00:00:00.000Z",
    status: "accepted",
  },
];

export const demoMessages: ConversationMessage[] = [
  {
    id: "msg-001",
    orderId: "order-physical-001",
    senderRole: "buyer",
    body: "Can you quote shipping to Manila and include protective packaging?",
    createdAt: "2026-05-26T02:05:00.000Z",
  },
  {
    id: "msg-002",
    orderId: "order-physical-001",
    senderRole: "artist",
    body: "Yes. DHL tracked shipping with reinforced packaging is 38 USDC.",
    createdAt: "2026-05-26T02:17:00.000Z",
  },
];

export function findArtwork(id: string) {
  return demoArtworks.find((artwork) => artwork.id === id);
}

export function findArtist(id: string) {
  return demoArtists.find((artist) => artist.id === id);
}

export function findCertificateByArtwork(artworkId: string) {
  return demoCertificates.find((certificate) => certificate.artworkId === artworkId);
}
