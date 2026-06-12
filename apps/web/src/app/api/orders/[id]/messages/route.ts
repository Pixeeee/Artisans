import { readString } from "@artisans/shared";
import { badRequest, ok } from "@/lib/api-response";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const errors: string[] = [];
  const body = readString(payload?.body, "body", errors);
  const senderId = readString(payload?.senderId, "senderId", errors);

  if (errors.length > 0) return badRequest(errors);

  return ok(
    {
      message: {
        id: `msg-${Date.now()}`,
        orderId: id,
        senderId,
        body,
        createdAt: new Date().toISOString(),
      },
    },
    { status: 201 },
  );
}
