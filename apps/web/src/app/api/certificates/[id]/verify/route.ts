import { demoCertificates, findArtwork, verifyCertificateHash } from "@artisans/shared";
import { badRequest, ok } from "@/lib/api-response";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certificate = demoCertificates.find((entry) => entry.id === id);
  if (!certificate) return badRequest(["Certificate was not found."], 404);

  const artwork = findArtwork(certificate.artworkId);
  if (!artwork) return badRequest(["Artwork was not found."], 404);

  return ok({
    certificate,
    verified: verifyCertificateHash(certificate, artwork.metadataHash),
    checks: {
      statusIssued: certificate.status === "issued",
      metadataHashMatchesArtwork: certificate.metadataHash === artwork.metadataHash,
      network: certificate.network,
    },
  });
}
