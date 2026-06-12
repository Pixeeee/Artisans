import { demoArtworks, validateArtworkCreate } from "@artisans/shared";
import { badRequest, ok } from "@/lib/api-response";

export async function GET() {
  return ok({ artworks: demoArtworks });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const result = validateArtworkCreate(payload);

  if (!result.ok || !result.value) {
    return badRequest(result.errors);
  }

  return ok(
    {
      artwork: {
        id: `artwork-${Date.now()}`,
        ...result.value,
        status: "draft",
        certificateStatus: "pending",
      },
    },
    { status: 201 },
  );
}
