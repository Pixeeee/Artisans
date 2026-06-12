import { createFreighterWalletSession, saveWalletSession } from "@/lib/wallet-session";

type FreighterApi = {
  getNetwork: () => Promise<{ network?: string; error?: { message?: string } } | string>;
  isConnected: () => Promise<{ isConnected?: boolean; error?: { message?: string } } | boolean>;
  requestAccess: () => Promise<{ address?: string; error?: { message?: string } } | string>;
  signTransaction: (
    xdr: string,
    options: { address?: string; networkPassphrase: string },
  ) => Promise<{ signedTxXdr?: string; error?: { message?: string } } | string>;
};

const FREIGHTER_TIMEOUT_MS = 3500;

function withTimeout<T>(promise: Promise<T>, ms = FREIGHTER_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      window.setTimeout(() => resolve(null), ms);
    }),
  ]);
}

async function loadFreighterApi(): Promise<FreighterApi | null> {
  if (typeof window === "undefined") return null;

  try {
    const module = (await import("@stellar/freighter-api")) as unknown as FreighterApi & {
      default?: FreighterApi;
      freighterApi?: FreighterApi;
    };
    const api = module.freighterApi ?? module.default ?? module;
    if (!api?.requestAccess || !api?.signTransaction) return null;
    return api as FreighterApi;
  } catch {
    return null;
  }
}

export async function connectFreighterWallet() {
  const freighter = await loadFreighterApi();
  if (!freighter) {
    return { ok: false as const, error: "Freighter API is unavailable. Refresh the page after enabling the extension." };
  }

  const connection = await withTimeout(freighter.isConnected());
  if (!connection) {
    return { ok: false as const, error: "Freighter did not respond. Unlock the extension, refresh, and try again." };
  }

  const connected = typeof connection === "boolean" ? connection : connection.isConnected;
  if (!connected) {
    return { ok: false as const, error: "Freighter extension was not detected by the page." };
  }

  const access = await withTimeout(freighter.requestAccess());
  if (!access) {
    return { ok: false as const, error: "Freighter request timed out. Unlock the extension and approve access." };
  }

  const address = typeof access === "string" ? access : access.address;
  const accessError = typeof access === "object" ? access.error?.message : undefined;
  if (accessError) return { ok: false as const, error: accessError };
  if (!address) return { ok: false as const, error: "Freighter did not return a public key." };

  const networkResult = await withTimeout(freighter.getNetwork());
  const network = typeof networkResult === "string" ? networkResult : networkResult?.network;
  const session = createFreighterWalletSession(address);
  if (!session) return { ok: false as const, error: "Freighter returned an invalid Stellar public key." };

  saveWalletSession(session);
  return { ok: true as const, session, network: network ?? "Unknown" };
}

export async function signFreighterTransaction(xdr: string, address: string, networkPassphrase: string) {
  const freighter = await loadFreighterApi();
  if (!freighter) throw new Error("Freighter API is unavailable. Refresh after enabling the extension.");

  const result = await withTimeout(
    freighter.signTransaction(xdr, {
      address,
      networkPassphrase,
    }),
    20_000,
  );

  if (!result) throw new Error("Freighter signing timed out.");
  if (typeof result === "string") return result;
  if (result.error?.message) throw new Error(result.error.message);
  if (!result.signedTxXdr) throw new Error("Freighter did not return signed transaction XDR.");
  return result.signedTxXdr;
}
