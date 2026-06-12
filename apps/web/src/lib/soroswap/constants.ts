export const SOROSWAP_TESTNET = {
  networkPassphrase: "Test SDF Network ; September 2015",
  routerContract: "CCJUD55AG6W5HAI5LRVNKAE5WDP5XGZBUDS5WNTIVDU7O264UZZE7BRD",
  factoryContract: "CDP3HMUH6SMS3S7NPGNDJLULCOXXEPSHY4JKUKMBNQMATHDHWXRRJTBY",
  xlmSac: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
  usdcSac: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
  usdcIssuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
  rpcUrl: "https://soroban-testnet.stellar.org",
};

export function parseXlmToStroops(value: string) {
  const normalized = value.trim();
  if (!/^\d+(\.\d{1,7})?$/.test(normalized)) return null;

  const [whole, fraction = ""] = normalized.split(".");
  const stroops = `${whole}${fraction.padEnd(7, "0")}`.replace(/^0+(?=\d)/, "");
  const parsed = BigInt(stroops || "0");
  return parsed > 0n ? parsed : null;
}

export function formatStroopsAsXlm(stroops: bigint) {
  const raw = stroops.toString().padStart(8, "0");
  const whole = raw.slice(0, -7) || "0";
  const fraction = raw.slice(-7).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}
