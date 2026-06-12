import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { signedXdr?: string } | null;
  const signedXdr = body?.signedXdr?.trim();

  if (!signedXdr) {
    return NextResponse.json({ error: "signedXdr is required." }, { status: 400 });
  }

  const apiKey = process.env.SOROSWAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Soroswap API key is not configured on the server. Set SOROSWAP_API_KEY to submit swaps." },
      { status: 503 },
    );
  }

  try {
    const { SoroswapSDK, SupportedNetworks } = await import("@soroswap/sdk");
    const soroswap = new SoroswapSDK({
      apiKey,
      defaultNetwork: SupportedNetworks.TESTNET,
    });
    const result = await soroswap.send(signedXdr, SupportedNetworks.TESTNET);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Soroswap transaction submission failed.",
      },
      { status: 502 },
    );
  }
}
