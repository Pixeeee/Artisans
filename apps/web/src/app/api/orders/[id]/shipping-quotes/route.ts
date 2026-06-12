import { readPositiveNumber, readString } from "@artisans/shared";
import { badRequest, ok } from "@/lib/api-response";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const errors: string[] = [];
  const amountUsdc = readPositiveNumber(payload?.amountUsdc, "amountUsdc", errors);
  const method = readString(payload?.method, "method", errors);
  const destinationCountry = readString(payload?.destinationCountry, "destinationCountry", errors);

  if (errors.length > 0) return badRequest(errors);

  return ok(
    {
      shippingQuote: {
        id: `quote-${Date.now()}`,
        orderId: id,
        amountUsdc,
        method,
        destinationCountry,
        status: "pending",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    { status: 201 },
  );
}
