import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { HomeLoader } from "@/components/home-loader";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <HomeLoader />
      <video
        aria-label="Artist painting in studio"
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
        poster="/assets/optimized/web-poster.jpg"
      >
        <source src="/assets/optimized/web.webm" type="video/webm" />
        <source src="/assets/optimized/web.mp4" type="video/mp4" />
      </video>
      <MainNav />

      <section className="home-hero-scene relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-28 pt-32 text-center sm:pb-32 sm:pt-36">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
          <h1 className="font-display animate-fade-rise max-w-5xl text-[clamp(3.1rem,9vw,7.2rem)] font-black leading-[0.92] tracking-[-0.035em] text-white">
            Where art carries <em className="not-italic text-white/62">proof</em> beyond the frame.
          </h1>
          <p className="animate-fade-rise-delay mt-6 max-w-2xl text-sm font-medium leading-6 text-white/68 sm:text-base">
            ArtisanS helps artists sell digital and physical work directly, with Stellar-powered authenticity certificates and USDC checkout kept simple for every buyer.
          </p>
          <div className="animate-fade-rise-delay-2 mt-9 flex flex-wrap justify-center gap-3">
            <Link className="liquid-glass rounded-full px-7 py-3 text-sm font-black text-white transition-transform hover:scale-[1.03]" href="/arts">
              Enter Marketplace
            </Link>
            <Link className="liquid-glass rounded-full px-7 py-3 text-sm font-black text-white transition-transform hover:scale-[1.03]" href="/earn">
              Sell With Proof
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
