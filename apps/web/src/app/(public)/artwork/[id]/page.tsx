import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { StatusPill } from "@/components/status-pill";
import { demoArtists, findArtwork, findCertificateByArtwork } from "@artisans/shared";

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artwork = findArtwork(id);

  if (!artwork) notFound();

  const artist = demoArtists.find((entry) => entry.id === artwork.artistId);
  const certificate = findCertificateByArtwork(artwork.id);
  const isPhysical = artwork.artType === "physical";

  return (
    <main className="min-h-screen bg-[#090909] px-5 pb-16 pt-28">
      <MainNav />
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-black">
          <Image alt={artwork.title} className="object-cover" fill priority sizes="(min-width: 1024px) 48vw, 100vw" src={artwork.previewPath} />
        </div>
        <div className="flex flex-col justify-between gap-8">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusPill tone={certificate?.status === "issued" ? "good" : "warn"}>
                {certificate?.status === "issued" ? "certificate issued" : "certificate pending"}
              </StatusPill>
              <StatusPill>{artwork.artType}</StatusPill>
              <StatusPill>{artwork.availability}</StatusPill>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-[-0.04em] md:text-5xl">{artwork.title}</h1>
            <p className="mt-3 text-xl font-black text-white/72">{artist?.displayName}</p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/68">{artwork.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="artisan-card rounded-lg p-5">
              <p className="text-sm font-black uppercase text-white/48">price</p>
              <p className="mt-1 text-3xl font-black">{artwork.priceUsdc} USDC</p>
              <p className="mt-4 text-sm leading-6 text-white/58">
                {isPhysical ? "Shipping quote is accepted before final payment." : "High-resolution file unlocks after confirmed payment."}
              </p>
            </div>
            <div className="artisan-card rounded-lg p-5">
              <p className="text-sm font-black uppercase text-white/48">certificate</p>
              <p className="mt-2 break-all text-sm leading-6 text-white/68">{certificate?.metadataHash}</p>
              <Link className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-sm font-black text-black" href={`/certificate/${certificate?.id}`}>
                verify proof
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="rounded-full bg-[var(--artisans-orange)] px-6 py-3 text-sm font-black text-white" href={`/orders/${isPhysical ? "order-physical-001" : "order-digital-001"}`}>
              {isPhysical ? "request shipping quote" : "buy and unlock"}
            </Link>
            <Link className="rounded-full bg-white/86 px-6 py-3 text-sm font-black text-black" href="/dashboard/buyer">
              buyer dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
