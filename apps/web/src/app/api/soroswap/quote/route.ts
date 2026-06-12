import { NextResponse } from "next/server";
import { isStellarPublicKey } from "@/lib/wallet-session";
import { parseXlmToStroops, SOROSWAP_TESTNET } from "@/lib/soroswap/constants";

function jsonSafe(value: unknown) {
  return JSON.parse(
    JSON.stringify(value, (_key, entry) => (typeof entry === "bigint" ? entry.toString() : entry)),
  ) as unknown;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    amountXlm?: string;
    walletAddress?: string;
    slippageBps?: string;
  } | null;

  const walletAddress = body?.walletAddress?.trim() ?? "";
  const amount = parseXlmToStroops(body?.amountXlm ?? "");
  const slippageBps = Number(body?.slippageBps ?? "50");

  if (!isStellarPublicKey(walletAddress)) {
    return NextResponse.json({ error: "Connect a Freighter Stellar wallet before requesting a swap." }, { status: 400 });
  }

  if (!amount) {
    return NextResponse.json({ error: "Enter a valid XLM amount with up to 7 decimals." }, { status: 400 });
  }

  if (!Number.isFinite(slippageBps) || slippageBps < 1 || slippageBps > 1000) {
    return NextResponse.json({ error: "Slippage must be between 1 and 1000 basis points." }, { status: 400 });
  }

  const apiKey = process.env.SOROSWAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Soroswap API key is not configured on the server.",
        setup: "Set SOROSWAP_API_KEY in your web environment to enable live Soroswap quote/build.",
        integration: {
          network: "testnet",
          routerContract: SOROSWAP_TESTNET.routerContract,
          factoryContract: SOROSWAP_TESTNET.factoryContract,
          assetIn: SOROSWAP_TESTNET.xlmSac,
          assetOut: SOROSWAP_TESTNET.usdcSac,
          amount: amount.toString(),
          slippageBps: String(slippageBps),
        },
      },
      { status: 503 },
    );
  }

  try {
    const { SoroswapSDK, SupportedNetworks, SupportedProtocols, TradeType } = await import("@soroswap/sdk");
    const soroswap = new SoroswapSDK({
      apiKey,
      defaultNetwork: SupportedNetworks.TESTNET,
    });

    const quote = await soroswap.quote({
      amount,
      assetIn: SOROSWAP_TESTNET.xlmSac,
      assetOut: SOROSWAP_TESTNET.usdcSac,
      maxHops: 2,
      protocols: [SupportedProtocols.SOROSWAP],
      slippageBps,
      tradeType: TradeType.EXACT_IN,
    });

    const build = await soroswap.build({
      from: walletAddress,
      quote,
      to: walletAddress,
    });

    return NextResponse.json({
      assetIn: "XLM",
      assetOut: "USDC",
      build: jsonSafe(build),
      quote: jsonSafe(quote),
      xdr: build.xdr,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Soroswap quote/build failed.",
      },
      { status: 502 },
    );
  }
}
