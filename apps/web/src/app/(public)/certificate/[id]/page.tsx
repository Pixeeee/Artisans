import Link from "next/link";
import { notFound } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { StatusPill } from "@/components/status-pill";
import { demoCertificates, findArtwork, demoArtists } from "@artisans/shared";

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certificate = demoCertificates.find((entry) => entry.id === id);
  if (!certificate) notFound();

  const artwork = findArtwork(certificate.artworkId);
  if (!artwork) notFound();

  const artist = demoArtists.find((entry) => entry.id === artwork.artistId);

  return (
    <main className="min-h-screen bg-[#090909] px-5 pb-16 pt-28">
      <MainNav />
      <section className="mx-auto max-w-5xl">
        <StatusPill tone="good">public proof page</StatusPill>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] md:text-5xl">ArtisanS certificate</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Artwork", artwork.title],
            ["Artist", artist?.displayName ?? "Unknown"],
            ["Creator wallet", certificate.artistWalletAddress],
            ["Metadata hash", certificate.metadataHash],
            ["Stellar reference", certificate.stellarTransactionHash],
            ["Network", certificate.network],
            ["Issued", new Date(certificate.issuedAt).toLocaleString()],
            ["Status", certificate.status],
          ].map(([label, value]) => (
            <div className="artisan-card rounded-lg p-5" key={label}>
              <p className="text-sm font-black uppercase text-white/48">{label}</p>
              <p className="mt-2 break-all text-sm leading-6 text-white/78">{value}</p>
            </div>
          ))}
        </div>
        <Link className="mt-8 inline-flex rounded-full bg-[var(--artisans-orange)] px-6 py-3 text-sm font-black" href={`/artwork/${artwork.id}`}>
          view artwork
        </Link>
      </section>
    </main>
  );
}
