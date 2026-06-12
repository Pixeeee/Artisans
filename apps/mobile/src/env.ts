export const mobileEnv = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "",
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  stellarHorizonUrl:
    process.env.EXPO_PUBLIC_STELLAR_HORIZON_URL ??
    "https://horizon-testnet.stellar.org",
  stellarNetwork: process.env.EXPO_PUBLIC_STELLAR_NETWORK ?? "testnet",
  stellarRpcUrl:
    process.env.EXPO_PUBLIC_STELLAR_RPC_URL ??
    "https://soroban-testnet.stellar.org",
};

export const isMobileSupabaseConfigured = Boolean(
  mobileEnv.supabaseUrl && mobileEnv.supabaseAnonKey,
);

export const isMobileApiConfigured = Boolean(mobileEnv.apiBaseUrl);
