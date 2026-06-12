"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Grid2X2,
  Grid3X3,
  ListFilter,
  Search,
} from "lucide-react";
import { BrandCube } from "@/components/brand-cube";
import { MainNav } from "@/components/main-nav";
import {
  demoArtists,
  demoArtworks,
  findCertificateByArtwork,
  type Artwork,
} from "@artisans/shared";
import { addBuyerIntentItem, type BuyerIntentAction } from "@/lib/cart-session";

type MarketArtwork = Artwork & {
  collectibleId: string;
  displayTitle: string;
  lastSaleUsdc: number;
  likes: number;
};

const sortOptions = [
  "Most Relevant",
  "Recently Listed",
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
  "Certificate Issued",
  "Most Likes",
  "Most Views",
];

const collectionThemes = [
  "from-[#ff2f7d] via-[#5b21b6] to-[#0ea5e9]",
  "from-[#fb923c] via-[#0f766e] to-[#1e3a8a]",
  "from-[#38bdf8] via-[#2563eb] to-[#7c3aed]",
  "from-[#f97316] via-[#e11d48] to-[#581c87]",
];

const marketArtworks: MarketArtwork[] = [
  ...demoArtworks.map((artwork, index) => ({
    ...artwork,
    collectibleId: artwork.id,
    displayTitle: artwork.title,
    lastSaleUsdc: Math.max(22, artwork.priceUsdc - 18),
    likes: 94 + index * 31,
  })),
  ...demoArtworks.map((artwork, index) => ({
    ...artwork,
    id: `${artwork.id}-edition-${index + 2}`,
    collectibleId: artwork.id,
    displayTitle:
      artwork.artType === "digital"
        ? `${artwork.title} #${String(index + 8).padStart(3, "0")}`
        : `${artwork.title} Proof #${index + 1}`,
    priceUsdc: artwork.priceUsdc + 30 + index * 24,
    lastSaleUsdc: Math.max(28, artwork.priceUsdc - 8 + index * 10),
    availability: index % 2 === 0 ? ("available" as const) : ("reserved" as const),
    likes: 146 + index * 37,
  })),
  ...demoArtworks.map((artwork, index) => ({
    ...artwork,
    id: `${artwork.id}-vault-${index + 1}`,
    collectibleId: artwork.id,
    displayTitle:
      artwork.artType === "digital"
        ? `${artwork.title} Vault`
        : `${artwork.title} Collector Card`,
    priceUsdc: artwork.priceUsdc + 75 + index * 44,
    lastSaleUsdc: Math.max(35, artwork.priceUsdc + 16 + index * 18),
    availability: "available" as const,
    likes: 204 + index * 43,
  })),
];

export default function ArtsPage() {
  const [activeArtistId, setActiveArtistId] = useState("all");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState(sortOptions[0]!);
  const [compactGrid, setCompactGrid] = useState(false);
  const [query, setQuery] = useState("");

  const collections = useMemo(
    () =>
      demoArtists.map((artist, index) => {
        const artworks = marketArtworks.filter((artwork) => artwork.artistId === artist.id);
        const floor = Math.min(...artworks.map((artwork) => artwork.priceUsdc));
        return {
          artist,
          artworks,
          floor,
          theme: collectionThemes[index % collectionThemes.length]!,
        };
      }),
    [],
  );

  const filteredArtworks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = marketArtworks.filter((artwork) => {
      const artist = demoArtists.find((entry) => entry.id === artwork.artistId);
      const matchesArtist = activeArtistId === "all" || artwork.artistId === activeArtistId;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        artwork.displayTitle.toLowerCase().includes(normalizedQuery) ||
        artwork.category.toLowerCase().includes(normalizedQuery) ||
        artist?.displayName.toLowerCase().includes(normalizedQuery);
      return matchesArtist && matchesQuery;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.priceUsdc - b.priceUsdc;
      if (sortBy === "Price: High to Low") return b.priceUsdc - a.priceUsdc;
      if (sortBy === "Most Likes") return b.likes - a.likes;
      if (sortBy === "Newest") return b.displayTitle.localeCompare(a.displayTitle);
      return a.displayTitle.localeCompare(b.displayTitle);
    });
  }, [activeArtistId, query, sortBy]);

  const groupedArtworks = useMemo(
    () =>
      demoArtists
        .map((artist) => ({
          artist,
          artworks: filteredArtworks.filter((artwork) => artwork.artistId === artist.id),
        }))
        .filter((group) => group.artworks.length > 0),
    [filteredArtworks],
  );

  return (
    <main className="min-h-screen bg-[#071121] text-white">
      <MainNav />
      <section className="mx-auto max-w-[1600px] px-5 pb-16 pt-28 sm:px-8">
        <TopCollections
          activeArtistId={activeArtistId}
          collections={collections}
          setActiveArtistId={setActiveArtistId}
        />

        <div className="mt-8">
          <h1 className="text-2xl font-black tracking-[-0.03em]">Explore</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Browse artists as collections, then discover their certified digital and physical works with Stellar proof and USDC pricing.
          </p>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[322px_minmax(0,1fr)]">
          <FilterSidebar activeArtistId={activeArtistId} setActiveArtistId={setActiveArtistId} />

          <section className="min-w-0">
            <div className="sticky top-24 z-20 mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#071121]/80 p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
              <label className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-slate-400">
                <Search size={17} />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search artists, collections, or arts"
                  value={query}
                />
              </label>
              <div className="flex items-center justify-end gap-3">
                <div className="relative">
                  <button
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/16 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/16"
                    onClick={() => setSortOpen((current) => !current)}
                    type="button"
                  >
                    <ChevronsUpDown size={16} /> Sort By <ChevronDown size={14} />
                  </button>
                  {sortOpen ? (
                    <div className="absolute right-0 top-14 z-30 w-60 rounded-2xl bg-white py-3 text-sm font-bold text-slate-950 shadow-[0_26px_70px_rgba(0,0,0,0.35)]">
                      {sortOptions.map((option) => (
                        <button
                          className={`block w-full px-5 py-3 text-left transition hover:bg-slate-100 ${
                            option === sortBy ? "text-[#2196f3]" : ""
                          }`}
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setSortOpen(false);
                          }}
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="hidden overflow-hidden rounded-full border border-white/16 bg-white/[0.04] sm:flex">
                  <button
                    className={`grid h-12 w-14 place-items-center transition ${!compactGrid ? "bg-[#2eb8f7]" : "hover:bg-white/10"}`}
                    onClick={() => setCompactGrid(false)}
                    type="button"
                  >
                    <Grid2X2 size={22} />
                  </button>
                  <button
                    className={`grid h-12 w-14 place-items-center transition ${compactGrid ? "bg-[#2eb8f7]" : "hover:bg-white/10"}`}
                    onClick={() => setCompactGrid(true)}
                    type="button"
                  >
                    <Grid3X3 size={22} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              {groupedArtworks.map((group) => (
                <section key={group.artist.id}>
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <ArtistAvatar artistName={group.artist.displayName} size="md" />
                      <div>
                        <h2 className="text-2xl font-black tracking-[-0.03em]">{group.artist.displayName} Collection</h2>
                        <p className="mt-1 text-sm text-slate-400">{group.artworks.length} certified works</p>
                      </div>
                    </div>
                    <Link className="text-sm font-black text-[#2eb8f7]" href={`/arts?artist=${group.artist.username}`}>
                      See artist
                    </Link>
                  </div>
                  <div
                    className={`grid min-w-0 gap-5 ${
                      compactGrid
                        ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-5"
                        : "sm:grid-cols-2 xl:grid-cols-4"
                    }`}
                  >
                    {group.artworks.map((artwork, index) => (
                      <ArtCard artwork={artwork} compact={compactGrid} index={index} key={artwork.id} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function TopCollections({
  activeArtistId,
  collections,
  setActiveArtistId,
}: {
  activeArtistId: string;
  collections: Array<{
    artist: (typeof demoArtists)[number];
    artworks: MarketArtwork[];
    floor: number;
    theme: string;
  }>;
  setActiveArtistId: (artistId: string) => void;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black tracking-[-0.03em]">
          Top Collections<span className="text-[#2eb8f7]">.</span>
        </h2>
        <div className="flex items-center gap-3">
          <button
            className={`rounded-full px-4 py-2 text-sm font-black transition ${
              activeArtistId === "all" ? "bg-white text-slate-950" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setActiveArtistId("all")}
            type="button"
          >
            See All
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition hover:bg-white/10" type="button">
            <ChevronLeft size={18} />
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition hover:bg-white/10" type="button">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {collections.map((collection, index) => (
          <button
            className={`group relative min-h-[205px] overflow-hidden rounded-lg text-left shadow-[0_18px_50px_rgba(0,0,0,0.28)] ring-1 ring-white/8 transition hover:-translate-y-1 hover:ring-[#2eb8f7]/60 ${
              activeArtistId === collection.artist.id ? "ring-2 ring-[#2eb8f7]" : ""
            }`}
            key={collection.artist.id}
            onClick={() => setActiveArtistId(collection.artist.id)}
            type="button"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${collection.theme}`} />
            <Image
              alt={`${collection.artist.displayName} featured artwork`}
              className="object-cover opacity-74 mix-blend-luminosity transition duration-500 group-hover:scale-105"
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              src={collection.artworks[0]?.previewPath ?? "/assets/icons/icon.png"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/28 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="mb-3 flex items-center gap-2">
                <ArtistAvatar artistName={collection.artist.displayName} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-lg font-black">{collection.artist.displayName}</p>
                    <BadgeCheck className="shrink-0 fill-[#2eb8f7] text-[#2eb8f7]" size={16} />
                  </div>
                  <p className="text-xs font-bold text-white/68">Floor {collection.floor} USDC</p>
                </div>
              </div>
              <p className="line-clamp-1 text-xs font-bold text-white/58">{collection.artist.bio}</p>
            </div>
            <div className="absolute right-3 top-3 rounded-full bg-black/48 px-3 py-1 text-xs font-black backdrop-blur">
              #{index + 1}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function FilterSidebar({
  activeArtistId,
  setActiveArtistId,
}: {
  activeArtistId: string;
  setActiveArtistId: (artistId: string) => void;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28">
        <div className="mb-5 flex items-center justify-between border-b border-white/28 pb-4">
          <h2 className="text-xl font-black">Filters</h2>
          <ListFilter size={22} />
        </div>
        <FilterGroup title="Listing Type">
          <CheckRow label="Buy Now" />
          <CheckRow label="Custom Shipping Quote" />
        </FilterGroup>
        <FilterGroup title="Curation">
          <CheckRow label="Verified Artist" />
          <CheckRow label="Certificate Issued" />
        </FilterGroup>
        <FilterGroup title="Price">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black">$</span>
            <input className="min-w-0 flex-1 rounded bg-white px-3 py-3 text-sm text-slate-950 outline-none" placeholder="Minimum" />
            <input className="min-w-0 flex-1 rounded bg-white px-3 py-3 text-sm text-slate-950 outline-none" placeholder="Maximum" />
          </div>
        </FilterGroup>
        <FilterGroup title="Artists">
          <button
            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left font-bold transition ${
              activeArtistId === "all" ? "bg-[#2eb8f7] text-white" : "hover:bg-white/8"
            }`}
            onClick={() => setActiveArtistId("all")}
            type="button"
          >
            All Collections <span>{marketArtworks.length}</span>
          </button>
          {demoArtists.map((artist) => (
            <button
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left font-bold transition ${
                activeArtistId === artist.id ? "bg-[#2eb8f7] text-white" : "hover:bg-white/8"
              }`}
              key={artist.id}
              onClick={() => setActiveArtistId(artist.id)}
              type="button"
            >
              {artist.displayName} <span>{marketArtworks.filter((artwork) => artwork.artistId === artist.id).length}</span>
            </button>
          ))}
        </FilterGroup>
        <FilterGroup title="Chains">
          <CheckRow checked label="Stellar Testnet" />
          <CheckRow label="Soroban Certificate" />
        </FilterGroup>
        <FilterGroup title="Categories">
          <CheckRow label="Digital Painting" />
          <CheckRow label="Digital Collage" />
          <CheckRow label="Physical Art" />
        </FilterGroup>
      </div>
    </aside>
  );
}

function ArtCard({ artwork, compact, index }: { artwork: MarketArtwork; compact: boolean; index: number }) {
  const router = useRouter();
  const artist = demoArtists.find((entry) => entry.id === artwork.artistId);
  const certificate = findCertificateByArtwork(artwork.collectibleId);
  const artistName = artist?.displayName ?? "Unknown artist";

  function saveBuyerIntent(action: BuyerIntentAction) {
    addBuyerIntentItem({
      id: `${artwork.id}:${action}`,
      artworkId: artwork.collectibleId,
      title: artwork.displayTitle,
      artistName,
      previewPath: artwork.previewPath,
      priceUsdc: artwork.priceUsdc,
      artType: artwork.artType,
      action,
    });
    router.push("/dashboard/buyer");
  }

  return (
    <article
      className="group overflow-hidden rounded-2xl bg-white text-slate-950 shadow-[0_18px_48px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(46,184,247,0.18)]"
    >
      <Link className="block" href={`/artwork/${artwork.collectibleId}`}>
        <div className={`relative overflow-hidden bg-slate-100 ${compact ? "aspect-square" : "aspect-[4/4.6]"}`}>
          <Image
            alt={artwork.displayTitle}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={artwork.previewPath}
          />
        </div>
      </Link>
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ArtistAvatar artistName={artistName} size="xs" />
            <p className="truncate text-xs font-black uppercase tracking-[-0.02em] text-slate-600">
              {artistName}
            </p>
            <BadgeCheck className="shrink-0 fill-[#2eb8f7] text-[#2eb8f7]" size={14} />
          </div>
          <BrandCube className="h-4 w-4 shrink-0" color="#64748b" />
        </div>
        <Link href={`/artwork/${artwork.collectibleId}`}>
          <h3 className="truncate text-lg font-black tracking-[-0.03em] transition hover:text-[#2196f3]">{artwork.displayTitle}</h3>
        </Link>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {artwork.editionTotal ? `${artwork.editionTotal} minted` : "1 minted"}
        </p>
        <div className="mt-3 grid grid-cols-[1fr_auto] items-center rounded-lg bg-slate-100">
          <div className="p-3">
            <p className="text-xs font-bold text-slate-500">Price</p>
          </div>
          <p className="px-3 text-sm font-black">$ {artwork.priceUsdc.toLocaleString()}</p>
        </div>
        <div className="mt-1 grid grid-cols-2 gap-1">
          <button
            className="rounded-lg bg-[#e8f4ff] py-3 text-sm font-black text-[#2196f3] transition hover:bg-[#d9eeff]"
            onClick={() => saveBuyerIntent("cart")}
            type="button"
          >
            Add
          </button>
          <button
            className="rounded-lg bg-[#e8f4ff] py-3 text-sm font-black text-[#2196f3] transition hover:bg-[#d9eeff]"
            onClick={() => saveBuyerIntent("buy")}
            type="button"
          >
            {artwork.artType === "physical" ? "Quote" : "Buy"}
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>{certificate?.status === "issued" ? "Verified proof" : "Pending proof"}</span>
          <span>{artwork.likes + index}</span>
        </div>
      </div>
    </article>
  );
}

function FilterGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="border-b border-white/28 py-5">
      <button className="mb-4 flex w-full items-center justify-between text-left text-lg font-black" type="button">
        {title}
        <ChevronDown size={18} />
      </button>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function CheckRow({ checked = false, label }: { checked?: boolean; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-base font-semibold">
      <input className="h-6 w-6 rounded accent-[#2eb8f7]" defaultChecked={checked} type="checkbox" />
      {label}
    </label>
  );
}

function ArtistAvatar({ artistName, size }: { artistName: string; size: "xs" | "sm" | "md" }) {
  const sizeClass = size === "md" ? "h-12 w-12" : size === "sm" ? "h-10 w-10" : "h-5 w-5";
  const textClass = size === "xs" ? "text-[10px]" : "text-sm";
  const initials = artistName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <span className={`${sizeClass} ${textClass} grid shrink-0 place-items-center rounded-full border border-white/30 bg-gradient-to-br from-[#ff5b38] to-[#2eb8f7] font-black text-white shadow-lg`}>
      {initials}
    </span>
  );
}
