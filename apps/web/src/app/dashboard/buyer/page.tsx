"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  MessageSquare,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";
import { BrandCube } from "@/components/brand-cube";
import { DashboardNamePill } from "@/components/dashboard-name-pill";
import { MarketplaceWorkflow } from "@/components/marketplace-workflow";
import { SoroswapConverter } from "@/components/soroswap-converter";
import { StatusPill } from "@/components/status-pill";
import {
  BUYER_INTENTS_CHANGED_EVENT,
  readBuyerIntentItems,
  type BuyerIntentItem,
} from "@/lib/cart-session";
import {
  canUnlockDigitalFile,
  demoArtworks,
  demoMessages,
  demoOrders,
  demoShippingQuotes,
  findArtist,
  findCertificateByArtwork,
} from "@artisans/shared";

export default function BuyerDashboardPage() {
  const [buyerIntentItems, setBuyerIntentItems] = useState<BuyerIntentItem[]>([]);
  const paidOrders = demoOrders.filter((order) => order.paymentStatus === "confirmed").length;
  const pendingOrders = demoOrders.length - paidOrders;
  const totalCommitted = demoOrders.reduce((sum, order) => sum + order.totalUsdc, 0);

  useEffect(() => {
    function syncBuyerItems() {
      setBuyerIntentItems(readBuyerIntentItems());
    }

    syncBuyerItems();
    window.addEventListener(BUYER_INTENTS_CHANGED_EVENT, syncBuyerItems);
    window.addEventListener("storage", syncBuyerItems);
    return () => {
      window.removeEventListener(BUYER_INTENTS_CHANGED_EVENT, syncBuyerItems);
      window.removeEventListener("storage", syncBuyerItems);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-5 py-6 text-white sm:px-8">
      <DashboardBackground />
      <DashboardHeader eyebrow="Collector workspace" />

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 pb-16 pt-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">
              <Zap size={14} /> Stellar Testnet ready
            </span>
            <h1 className="mt-6 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">
              Collect verified art without losing the proof.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">
              Track orders, digital unlocks, shipping quotes, and certificate proof from one ArtisanS buyer workspace.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <MetricCard label="Total committed" value={`${totalCommitted} USDC`} />
              <MetricCard label="Paid orders" value={String(paidOrders)} />
              <MetricCard label="Pending" value={String(pendingOrders)} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <Wallet className="text-[#f54733]" size={22} />
              <div>
                <h2 className="text-lg font-black tracking-[-0.03em]">Profile setup</h2>
                <p className="text-sm text-slate-400">Finish buyer details from your wallet account.</p>
              </div>
            </div>
            <Link className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#f54733]/40 bg-[#f54733]/16 px-5 py-3 text-sm font-black text-white transition hover:bg-[#f54733]" href="/dashboard">
              Configure account <ArrowRight size={16} />
            </Link>
          </section>

          <SoroswapConverter />

          <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl">
            <h2 className="text-lg font-black tracking-[-0.03em]">Recent order conversation</h2>
            <div className="mt-4 space-y-3">
              {demoMessages.map((message) => (
                <div className="rounded-2xl border border-white/10 bg-black/24 p-4" key={message.id}>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{message.senderRole}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{message.body}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <MarketplaceWorkflow />
          <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f54733]">Orders</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Purchase activity</h2>
              </div>
              <Link className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-black text-slate-200 transition hover:border-[#f54733]/50 hover:text-white" href="/arts">
                Browse arts <ArrowRight size={15} />
              </Link>
            </div>

            {buyerIntentItems.length > 0 ? (
              <section className="mt-6 rounded-2xl border border-[#f54733]/20 bg-[#f54733]/8 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f54733]">Saved from marketplace</p>
                    <h3 className="mt-1 text-xl font-black tracking-[-0.03em]">Cart and buy requests</h3>
                  </div>
                  <span className="text-xs font-black text-slate-400">{buyerIntentItems.length} item(s)</span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {buyerIntentItems.map((item) => (
                    <Link
                      className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/54 p-3 transition hover:border-[#f54733]/50 md:grid-cols-[76px_1fr]"
                      href={`/artwork/${item.artworkId}`}
                      key={item.id}
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-white/[0.05]">
                        <Image alt={item.title} className="object-cover" fill sizes="76px" src={item.previewPath} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <StatusPill tone={item.action === "buy" ? "warn" : "neutral"}>
                            {item.action === "buy" ? (item.artType === "physical" ? "quote requested" : "buy intent") : "cart"}
                          </StatusPill>
                          <StatusPill>{item.artType}</StatusPill>
                        </div>
                        <h4 className="mt-2 truncate text-sm font-black">{item.title}</h4>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          by {item.artistName} | {item.priceUsdc} USDC
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-6 space-y-4">
              {demoOrders.map((order) => {
                const artwork = demoArtworks.find((entry) => entry.id === order.artworkId);
                const artist = artwork ? findArtist(artwork.artistId) : undefined;
                const certificate = artwork ? findCertificateByArtwork(artwork.id) : undefined;
                const quote = demoShippingQuotes.find((entry) => entry.orderId === order.id);
                const unlocked = canUnlockDigitalFile({
                  orderType: order.orderType,
                  orderStatus: order.status,
                  paymentStatus: order.paymentStatus,
                });

                return (
                  <Link
                    className="group grid gap-4 rounded-2xl border border-white/10 bg-slate-950/54 p-4 transition hover:-translate-y-0.5 hover:border-[#f54733]/50 hover:bg-slate-900/80 md:grid-cols-[112px_1fr_auto]"
                    href={`/orders/${order.id}`}
                    key={order.id}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/[0.05]">
                      {artwork ? <Image alt={artwork.title} className="object-cover" fill sizes="112px" src={artwork.previewPath} /> : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <StatusPill tone={order.paymentStatus === "confirmed" ? "good" : "warn"}>{order.paymentStatus}</StatusPill>
                        <StatusPill>{order.orderType}</StatusPill>
                        {unlocked ? <StatusPill tone="good">digital unlocked</StatusPill> : null}
                      </div>
                      <h3 className="mt-3 truncate text-xl font-black tracking-[-0.03em]">{artwork?.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        by {artist?.displayName ?? "Unknown artist"} | {order.totalUsdc} USDC | {order.status}
                      </p>
                      <div className="mt-4 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                        <OrderState icon={<ShieldCheck size={15} />} label={certificate?.status === "issued" ? "Certificate issued" : "Certificate pending"} />
                        <OrderState icon={unlocked ? <Download size={15} /> : <PackageCheck size={15} />} label={unlocked ? "Original file available" : "Locked until payment"} />
                        {quote ? <OrderState icon={<Truck size={15} />} label={`${quote.method} | ${quote.amountUsdc} USDC`} /> : null}
                        <OrderState icon={<MessageSquare size={15} />} label="Order conversation open" />
                      </div>
                    </div>
                    <span className="self-center rounded-full border border-[#f54733]/40 bg-[#f54733]/16 px-5 py-2 text-center text-sm font-black text-white transition group-hover:bg-[#f54733]">
                      Open
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function DashboardHeader({ eyebrow }: { eyebrow: string }) {
  return (
    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-2xl">
      <Link className="flex items-center gap-3" href="/">
        <BrandCube className="h-9 w-9" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/72">ArtisanS</p>
          <p className="text-xs text-slate-400">{eyebrow}</p>
        </div>
      </Link>
      <nav className="hidden items-center gap-2 sm:flex">
        <Link className="rounded-full px-4 py-2 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white" href="/dashboard">
          Setup
        </Link>
        <DashboardNamePill />
      </nav>
    </header>
  );
}

function DashboardBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(245,71,51,0.2),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(6,182,212,0.16),transparent_30%),linear-gradient(135deg,#050816_0%,#08111f_58%,#120b14_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_70px] opacity-30" />
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function OrderState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
      <span className="text-cyan-200">{icon}</span>
      {label}
    </span>
  );
}
