import { readWalletSession } from "@/lib/wallet-session";

export type BuyerIntentAction = "cart" | "buy";

export type BuyerIntentItem = {
  id: string;
  artworkId: string;
  title: string;
  artistName: string;
  previewPath: string;
  priceUsdc: number;
  artType: "digital" | "physical";
  action: BuyerIntentAction;
  addedAt: string;
};

export const BUYER_INTENTS_CHANGED_EVENT = "artisans-buyer-intents-changed";

const BUYER_INTENTS_KEY = "artisans.buyer.intents.v1";
const GUEST_WALLET_KEY = "guest";

function getActiveBuyerKey() {
  const wallet = readWalletSession();
  return wallet?.walletAddress.toLowerCase() ?? GUEST_WALLET_KEY;
}

function readIntentStore() {
  if (typeof window === "undefined") return {};

  try {
    const rawStore = window.localStorage.getItem(BUYER_INTENTS_KEY);
    if (!rawStore) return {};
    return JSON.parse(rawStore) as Record<string, BuyerIntentItem[]>;
  } catch {
    window.localStorage.removeItem(BUYER_INTENTS_KEY);
    return {};
  }
}

function writeIntentStore(store: Record<string, BuyerIntentItem[]>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BUYER_INTENTS_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(BUYER_INTENTS_CHANGED_EVENT));
}

export function readBuyerIntentItems() {
  const store = readIntentStore();
  return store[getActiveBuyerKey()] ?? [];
}

export function addBuyerIntentItem(item: Omit<BuyerIntentItem, "addedAt">) {
  const store = readIntentStore();
  const key = getActiveBuyerKey();
  const currentItems = store[key] ?? [];
  const nextItem = { ...item, addedAt: new Date().toISOString() };
  const existingIndex = currentItems.findIndex((entry) => entry.id === item.id);
  const nextItems =
    existingIndex >= 0
      ? currentItems.map((entry, index) => (index === existingIndex ? nextItem : entry))
      : [nextItem, ...currentItems];

  store[key] = nextItems.slice(0, 50);
  writeIntentStore(store);
}
