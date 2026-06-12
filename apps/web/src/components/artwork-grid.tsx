import type { Artwork } from "@artisans/shared";
import { demoArtists, findCertificateByArtwork } from "@artisans/shared";
import Image from "next/image";
import Link from "next/link";

export function ArtworkGrid({ artworks }: { artworks: Artwork[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {artworks.map((artwork) => {
        const artist = demoArtists.find((entry) => entry.id === artwork.artistId);
        const certificate = findCertificateByArtwork(artwork.id);

        return (
          <Link
            className="artisan-card group overflow-hidden rounded-lg"
            href={`/artwork/${artwork.id}`}
            key={artwork.id}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
              <Image
                alt={artwork.title}
                className="object-cover transition duration-500 group-hover:scale-105"
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                src={artwork.previewPath}
              />
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black leading-none">{artwork.title}</h3>
                  <p className="mt-1 text-sm font-bold text-white/60">{artist?.displayName}</p>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-black uppercase text-white/72">
                  {artwork.artType}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-black">
                <span>{artwork.priceUsdc} USDC</span>
                <span className={certificate?.status === "issued" ? "text-[var(--artisans-orange)]" : "text-white/50"}>
                  {certificate?.status === "issued" ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
