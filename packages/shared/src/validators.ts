import type { ArtworkType } from "./types";

export interface ValidationResult<T> {
  ok: boolean;
  value?: T;
  errors: string[];
}

export function readString(value: unknown, field: string, errors: string[]) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${field} is required.`);
    return "";
  }
  return value.trim();
}

export function readArtworkType(value: unknown, errors: string[]): ArtworkType {
  if (value === "digital" || value === "physical") return value;
  errors.push("artType must be digital or physical.");
  return "digital";
}

export function readPositiveNumber(value: unknown, field: string, errors: string[]) {
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    errors.push(`${field} must be a positive number.`);
    return 0;
  }
  return numberValue;
}

export function validateArtworkCreate(input: unknown): ValidationResult<{
  title: string;
  description: string;
  artType: ArtworkType;
  category: string;
  priceUsdc: number;
}> {
  const errors: string[] = [];
  const record = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const value = {
    title: readString(record.title, "title", errors),
    description: readString(record.description, "description", errors),
    artType: readArtworkType(record.artType, errors),
    category: readString(record.category, "category", errors),
    priceUsdc: readPositiveNumber(record.priceUsdc, "priceUsdc", errors),
  };

  return { ok: errors.length === 0, value: errors.length === 0 ? value : undefined, errors };
}

export function validateWalletAddress(value: unknown): ValidationResult<string> {
  const errors: string[] = [];
  const address = readString(value, "walletAddress", errors);
  if (address && !/^[GC][A-Z0-9]{20,}$/.test(address)) {
    errors.push("walletAddress must look like a Stellar public key or contract address.");
  }
  return { ok: errors.length === 0, value: errors.length === 0 ? address : undefined, errors };
}
