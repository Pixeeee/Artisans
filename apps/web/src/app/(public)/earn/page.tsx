import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { MarketplaceWorkflow } from "@/components/marketplace-workflow";

const steps = [
  "Create your artist profile and connect a Stellar wallet.",
  "Upload digital or physical artwork with signature settings.",
  "Publish listings with USDC price and certificate proof.",
  "Sell directly, message buyers, and fulfill digital or physical orders.",
];

export default function EarnPage() {
  return (
    <main className="min-h-screen bg-[#090909] px-5 pb-16 pt-28">
      <MainNav />
      <section className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-[-0.04em] md:text-5xl">earn with proof</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/66">
            ArtisanS gives artists a storefront, a certificate system, direct buyer conversations, and Stellar-powered USDC payments without making buyers learn crypto first.
          </p>
          <Link className="mt-8 inline-flex rounded-full bg-[var(--artisans-orange)] px-6 py-3 text-sm font-black" href="/sign-up">
            start artist profile
          </Link>
        </div>
        <ol className="artisan-card rounded-lg p-5">
          {steps.map((step, index) => (
            <li className="flex gap-4 border-b border-white/10 py-5 last:border-b-0" key={step}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-lg font-black text-black">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-white/76">{step}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto mt-8 max-w-6xl">
        <MarketplaceWorkflow />
      </section>
    </main>
  );
}
