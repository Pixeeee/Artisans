import type { Artwork, Certificate } from "./types";

export interface CertificatePayload {
  artworkId: string;
  artistId: string;
  artistWalletAddress: string;
  title: string;
  artType: string;
  previewPath: string;
  originalFilePath?: string;
  physicalDetails?: string;
  createdAt: string;
  certificateVersion: "artisans-cert-v1";
}

export function createCertificatePayload(input: {
  artwork: Artwork;
  artistWalletAddress: string;
  createdAt: string;
}): CertificatePayload {
  const { artwork, artistWalletAddress, createdAt } = input;
  return {
    artworkId: artwork.id,
    artistId: artwork.artistId,
    artistWalletAddress,
    title: artwork.title,
    artType: artwork.artType,
    previewPath: artwork.previewPath,
    originalFilePath: artwork.originalFilePath,
    physicalDetails: [artwork.medium, artwork.dimensions].filter(Boolean).join(" | ") || undefined,
    createdAt,
    certificateVersion: "artisans-cert-v1",
  };
}

export function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }

  return `{${Object.entries(value)
    .filter(([, entryValue]) => entryValue !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableJson(entryValue)}`)
    .join(",")}}`;
}

export async function createSha256Hash(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `sha256:${hex}`;
}

export function verifyCertificateHash(certificate: Certificate, expectedHash: string) {
  return certificate.metadataHash === expectedHash && certificate.status === "issued";
}
