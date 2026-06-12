export type WalletSession = {
  version: 1;
  provider: "metamask" | "freighter";
  walletAddress: string;
  nickname: string;
  network: "stellar-testnet";
  connectedAt: string;
};

export const WALLET_SESSION_KEY = "artisans.wallet.session.v1";

const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const STELLAR_PUBLIC_KEY_PATTERN = /^G[A-Z2-7]{55}$/;

export function isEvmAddress(value: unknown): value is string {
  return typeof value === "string" && EVM_ADDRESS_PATTERN.test(value);
}

export function isStellarPublicKey(value: unknown): value is string {
  return typeof value === "string" && STELLAR_PUBLIC_KEY_PATTERN.test(value);
}

export function isWalletAddress(value: unknown): value is string {
  return isEvmAddress(value) || isStellarPublicKey(value);
}

export function shortWalletAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function createWalletSession(walletAddress: string, provider: WalletSession["provider"] = "metamask"): WalletSession | null {
  if (!isEvmAddress(walletAddress)) return null;

  return {
    version: 1,
    provider,
    walletAddress,
    nickname: shortWalletAddress(walletAddress),
    network: "stellar-testnet",
    connectedAt: new Date().toISOString(),
  };
}

export function createFreighterWalletSession(walletAddress: string): WalletSession | null {
  if (!isStellarPublicKey(walletAddress)) return null;

  return {
    version: 1,
    provider: "freighter",
    walletAddress,
    nickname: shortWalletAddress(walletAddress),
    network: "stellar-testnet",
    connectedAt: new Date().toISOString(),
  };
}

export function saveWalletSession(session: WalletSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(WALLET_SESSION_KEY, JSON.stringify(session));
}

export function readWalletSession(): WalletSession | null {
  if (typeof window === "undefined") return null;

  try {
    const rawSession = window.sessionStorage.getItem(WALLET_SESSION_KEY);
    if (!rawSession) return null;

    const parsed = JSON.parse(rawSession) as Partial<WalletSession>;
    if (
      parsed.version !== 1 ||
      (parsed.provider !== "metamask" && parsed.provider !== "freighter") ||
      parsed.network !== "stellar-testnet" ||
      !isWalletAddress(parsed.walletAddress) ||
      typeof parsed.connectedAt !== "string"
    ) {
      clearWalletSession();
      return null;
    }

    return {
      version: 1,
      provider: parsed.provider,
      walletAddress: parsed.walletAddress,
      nickname: parsed.nickname || shortWalletAddress(parsed.walletAddress),
      network: "stellar-testnet",
      connectedAt: parsed.connectedAt,
    };
  } catch {
    clearWalletSession();
    return null;
  }
}

export function clearWalletSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(WALLET_SESSION_KEY);
}

export async function revokeMetaMaskAccountAccess() {
  if (typeof window === "undefined" || !window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [{ eth_accounts: {} }],
    });
    return true;
  } catch {
    return false;
  }
}
