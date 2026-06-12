import type { UserRole } from "@artisans/shared";
import { isWalletAddress } from "@/lib/wallet-session";

export type AccountMode = Exclude<UserRole, "admin"> | "both";

export type ProfileSession = {
  version: 1;
  walletAddress: string;
  username: string;
  displayName: string;
  email: string;
  emailVerificationProvider: "none" | "google";
  emailVerificationStatus: "unverified" | "pending" | "verified";
  accountMode: AccountMode;
  stellarPayoutWallet?: string;
  location?: string;
  bio?: string;
  updatedAt: string;
};

export type ProfileDraft = {
  walletAddress: string;
  username: string;
  displayName: string;
  email: string;
  accountMode: AccountMode;
  stellarPayoutWallet?: string;
  location?: string;
  bio?: string;
};

export const PROFILE_SESSION_KEY = "artisans.profile.session.v1";
export const PROFILE_STORE_KEY = "artisans.profile.store.v1";
export const PROFILE_CHANGED_EVENT = "artisans-profile-changed";
export const USERNAME_REGISTRY_KEY = "artisans.username.registry.v1";

const EMAIL_PATTERN = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[^\s@<>]{2,}$/;
const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;
const STELLAR_PUBLIC_KEY_PATTERN = /^G[A-Z2-7]{55}$/;
const ACCOUNT_MODES = ["buyer", "artist", "both"] as const;
const EMAIL_VERIFICATION_STATUSES = ["unverified", "pending", "verified"] as const;

function isAccountMode(value: unknown): value is AccountMode {
  return typeof value === "string" && ACCOUNT_MODES.includes(value as AccountMode);
}

function isEmailVerificationStatus(value: unknown): value is ProfileSession["emailVerificationStatus"] {
  return (
    typeof value === "string" &&
    EMAIL_VERIFICATION_STATUSES.includes(value as ProfileSession["emailVerificationStatus"])
  );
}

function cleanText(value: string, maxLength: number) {
  return value
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function createUsernameCandidate(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 24);
}

function readUsernameRegistry() {
  if (typeof window === "undefined") return {};

  try {
    const rawRegistry = window.localStorage.getItem(USERNAME_REGISTRY_KEY);
    if (!rawRegistry) return {};
    const parsed = JSON.parse(rawRegistry) as Record<string, string>;
    return Object.fromEntries(
      Object.entries(parsed).filter(([username, walletAddress]) => USERNAME_PATTERN.test(username) && isWalletAddress(walletAddress)),
    );
  } catch {
    window.localStorage.removeItem(USERNAME_REGISTRY_KEY);
    return {};
  }
}

export function isUsernameAvailable(username: string, walletAddress: string) {
  if (!USERNAME_PATTERN.test(username) || !isWalletAddress(walletAddress)) return false;
  const registry = readUsernameRegistry();
  return !registry[username] || registry[username].toLowerCase() === walletAddress.toLowerCase();
}

function reserveUsername(username: string, walletAddress: string) {
  if (typeof window === "undefined") return;
  const registry = readUsernameRegistry();
  registry[username] = walletAddress;
  window.localStorage.setItem(USERNAME_REGISTRY_KEY, JSON.stringify(registry));
}

function normalizeWalletKey(walletAddress: string) {
  return walletAddress.toLowerCase();
}

function readProfileStore() {
  if (typeof window === "undefined") return {};

  try {
    const rawStore = window.localStorage.getItem(PROFILE_STORE_KEY);
    if (!rawStore) return {};
    const parsed = JSON.parse(rawStore) as Record<string, ProfileSession>;
    return Object.fromEntries(
      Object.entries(parsed).filter(([, profile]) => isWalletAddress(profile?.walletAddress) && profile?.version === 1),
    );
  } catch {
    window.localStorage.removeItem(PROFILE_STORE_KEY);
    return {};
  }
}

export function validateProfileDraft(draft: ProfileDraft) {
  const displayName = cleanText(draft.displayName, 40);
  const username = createUsernameCandidate(draft.username);
  const email = draft.email.trim().toLowerCase();
  const stellarPayoutWallet = cleanText(draft.stellarPayoutWallet ?? "", 56);
  const location = cleanText(draft.location ?? "", 80);
  const bio = cleanText(draft.bio ?? "", 280);
  const errors: string[] = [];

  if (!isWalletAddress(draft.walletAddress)) errors.push("A valid connected wallet is required.");
  if (!USERNAME_PATTERN.test(username)) errors.push("Username must be 3-24 characters using lowercase letters, numbers, or underscore.");
  if (typeof window !== "undefined" && USERNAME_PATTERN.test(username) && !isUsernameAvailable(username, draft.walletAddress)) {
    errors.push("Username is already reserved by another wallet in this session.");
  }
  if (displayName.length < 2) errors.push("Display name must be at least 2 characters.");
  if (displayName.length > 40) errors.push("Display name must be 40 characters or less.");
  if (!EMAIL_PATTERN.test(email)) errors.push("Enter a valid email address.");
  if (!isAccountMode(draft.accountMode)) errors.push("Choose a valid account role.");
  if (stellarPayoutWallet && !STELLAR_PUBLIC_KEY_PATTERN.test(stellarPayoutWallet)) {
    errors.push("Stellar payout wallet must be a valid public key beginning with G.");
  }

  if (errors.length > 0) {
    return { ok: false as const, errors };
  }

  return {
    ok: true as const,
    value: {
      version: 1,
      walletAddress: draft.walletAddress,
      username,
      displayName,
      email,
      accountMode: draft.accountMode,
      emailVerificationProvider: "none",
      emailVerificationStatus: "unverified",
      stellarPayoutWallet: stellarPayoutWallet || undefined,
      location: location || undefined,
      bio: bio || undefined,
      updatedAt: new Date().toISOString(),
    } satisfies ProfileSession,
  };
}

export function saveProfileSession(profile: ProfileSession) {
  if (typeof window === "undefined") return;
  reserveUsername(profile.username, profile.walletAddress);
  const store = readProfileStore();
  store[normalizeWalletKey(profile.walletAddress)] = profile;
  window.localStorage.setItem(PROFILE_STORE_KEY, JSON.stringify(store));
  window.localStorage.setItem(PROFILE_SESSION_KEY, normalizeWalletKey(profile.walletAddress));
  window.dispatchEvent(new Event(PROFILE_CHANGED_EVENT));
}

export function readProfileSession(): ProfileSession | null {
  if (typeof window === "undefined") return null;

  try {
    const currentWalletKey = window.localStorage.getItem(PROFILE_SESSION_KEY);
    if (!currentWalletKey) return null;

    const profile = readProfileStore()[currentWalletKey];
    if (!profile) return null;

    const parsed = profile as Partial<ProfileSession>;
    if (
      parsed.version !== 1 ||
      !isWalletAddress(parsed.walletAddress) ||
      typeof parsed.username !== "string" ||
      typeof parsed.displayName !== "string" ||
      typeof parsed.email !== "string" ||
      !isAccountMode(parsed.accountMode) ||
      !isEmailVerificationStatus(parsed.emailVerificationStatus)
    ) {
      clearProfileSession();
      return null;
    }

    const validated = validateProfileDraft({
      walletAddress: parsed.walletAddress,
      username: parsed.username,
      displayName: parsed.displayName,
      email: parsed.email,
      accountMode: parsed.accountMode,
      stellarPayoutWallet: parsed.stellarPayoutWallet,
      location: parsed.location,
      bio: parsed.bio,
    });

    if (!validated.ok) {
      clearProfileSession();
      return null;
    }

    return {
      ...validated.value,
      emailVerificationProvider: parsed.emailVerificationProvider === "google" ? "google" : "none",
      emailVerificationStatus: parsed.emailVerificationStatus,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : validated.value.updatedAt,
    };
  } catch {
    clearProfileSession();
    return null;
  }
}

export function readProfileSessionForWallet(walletAddress: string): ProfileSession | null {
  if (typeof window === "undefined" || !isWalletAddress(walletAddress)) return null;

  window.localStorage.setItem(PROFILE_SESSION_KEY, normalizeWalletKey(walletAddress));
  const profile = readProfileSession();
  if (!profile || profile.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) return null;

  return profile;
}

export function clearProfileSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_SESSION_KEY);
  window.dispatchEvent(new Event(PROFILE_CHANGED_EVENT));
}
