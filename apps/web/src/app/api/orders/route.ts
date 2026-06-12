import { demoArtworks, getInitialOrderStatus, readString } from "@artisans/shared";
import { badRequest, ok } from "@/lib/api-response";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const errors: string[] = [];
  const artworkId = readString(payload?.artworkId, "artworkId", errors);
  const buyerId = readString(payload?.buyerId, "buyerId", errors);
  const artwork = demoArtworks.find((entry) => entry.id === artworkId);

  if (!artwork) errors.push("Artwork was not found.");
  if (errors.length > 0 || !artwork) return badRequest(errors);

  const orderStatus = getInitialOrderStatus(artwork.artType);
  const shippingUsdc = artwork.artType === "physical" ? 0 : 0;

  return ok(
    {
      order: {
        id: `order-${Date.now()}`,
        buyerId,
        artistId: artwork.artistId,
        artworkId: artwork.id,
        orderType: artwork.artType,
        status: orderStatus,
        subtotalUsdc: artwork.priceUsdc,
        shippingUsdc,
        totalUsdc: artwork.priceUsdc + shippingUsdc,
        paymentStatus: "pending",
      },
    },
    { status: 201 },
  );
}
