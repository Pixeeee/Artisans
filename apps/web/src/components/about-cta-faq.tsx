"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Mail, ShieldCheck } from "lucide-react";
import { BrandCube } from "./brand-cube";
import { MarketplaceWorkflow } from "./marketplace-workflow";

const faqs = [
  {
    question: "What does ArtisanS verify?",
    answer:
      "Each artwork gets a certificate with creator wallet, metadata hash, timestamp, and Stellar reference so buyers can inspect public proof of origin.",
  },
  {
    question: "Is ArtisanS an NFT marketplace?",
    answer:
      "V1 starts as authenticity proof and direct artist sales, not transferable NFT ownership. Ownership history stays inside ArtisanS orders.",
  },
  {
    question: "Can artists sell physical art?",
    answer:
      "Yes. Physical orders support custom shipping quotes, buyer and artist messages, delivery status, and certificate cards.",
  },
  {
    question: "How do digital downloads work?",
    answer:
      "Digital originals stay locked until payment is confirmed. After confirmation, the buyer gets authorized access to the high-resolution file.",
  },
  {
    question: "Why use Stellar and USDC?",
    answer:
      "Stellar gives low-cost settlement and public certificate references. USDC keeps prices understandable for mainstream artists and collectors.",
  },
];

export function AboutCtaFaq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#050816] text-white">
      <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
        <section className="grid items-stretch gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f54733]">About ArtisanS</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">
              A direct art marketplace built around proof, payment, and trust.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              ArtisanS helps artists sell digital and physical art while giving buyers a simple certificate page backed by Stellar references.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="rounded-full bg-[#f54733] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ff6b56]" href="/sign-up">
                Start artist profile
              </Link>
              <Link className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-slate-200 transition hover:border-white/24 hover:text-white" href="/arts">
                Explore arts
              </Link>
            </div>
          </div>

          <section className="flex flex-col justify-center gap-3">
            {faqs.map((faq, index) => {
              const active = activeIndex === index;

              return (
                <button
                  className="rounded-2xl border border-white/10 bg-slate-950/64 p-4 text-left transition hover:border-[#f54733]/40"
                  key={faq.question}
                  onClick={() => setActiveIndex(active ? null : index)}
                  type="button"
                >
                  <span className="flex items-center justify-between gap-4 text-sm font-black text-white">
                    <span>{faq.question}</span>
                    {active ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                  {active ? <span className="mt-3 block text-xs leading-5 text-slate-400">{faq.answer}</span> : null}
                </button>
              );
            })}
          </section>
        </section>

        <div className="mt-5">
          <MarketplaceWorkflow />
        </div>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80 py-8">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-3">
              <BrandCube className="h-9 w-9" />
              <span className="text-sm font-black uppercase tracking-[0.18em] text-white/72">ArtisanS</span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-5 text-slate-400">
              Verified art, direct from artists, with Stellar-powered certificates and simple USDC checkout.
            </p>
          </div>

          <FooterLinks title="Marketplace" items={["Arts", "Earn", "Certificates", "Orders"]} />
          <FooterLinks title="Company" items={["About", "Support", "Terms", "Privacy"]} />

          <form className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-sm font-black text-white">
              <Mail size={16} className="text-[#f54733]" /> Private beta updates
            </div>
            <div className="mt-3 flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/24 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#f54733]/60"
                placeholder="Email"
                type="email"
              />
              <button className="rounded-xl bg-[#f54733] px-4 py-2 text-xs font-black text-white" type="button">
                Join
              </button>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs leading-5 text-slate-500">
              <ShieldCheck size={14} /> Emails stay private for verification and product updates.
            </p>
          </form>
        </div>
        <div className="mx-auto mt-6 flex w-full max-w-6xl flex-col gap-2 px-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>All rights reserved. (c) 2026 ArtisanS</span>
          <span>Stellar Testnet proof for MVP development</span>
        </div>
      </footer>
    </div>
  );
}

function FooterLinks({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-black text-white">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item}>
            <Link className="text-xs text-slate-400 transition hover:text-white" href={item === "Arts" ? "/arts" : "#"}>
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
