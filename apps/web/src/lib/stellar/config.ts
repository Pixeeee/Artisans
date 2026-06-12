import { getOptionalServerEnv } from "../env";

export function getStellarPaymentConfig() {
  const network = getOptionalServerEnv("NEXT_PUBLIC_STELLAR_NETWORK", "testnet") === "mainnet" ? "mainnet" : "testnet";

  return {
    network,
    assetIssuer: getOptionalServerEnv("STELLAR_USDC_ISSUER", "GTESTUSDCISSUERPLACEHOLDER000000000000000000"),
    treasuryWallet: getOptionalServerEnv("ARTISANS_TREASURY_WALLET", "GARTISANSTREASURYPLACEHOLDER000000000000000"),
    platformFeeBps: Number(getOptionalServerEnv("ARTISANS_PLATFORM_FEE_BPS", "500")),
  } as const;
}
