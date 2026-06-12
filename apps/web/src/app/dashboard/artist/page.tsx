"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  FileCheck2,
  ImagePlus,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Truck,
  Upload,
  Wallet,
  Zap,
} from "lucide-react";
import { BrandCube } from "@/components/brand-cube";
import { DashboardNamePill } from "@/components/dashboard-name-pill";
import { MarketplaceWorkflow } from "@/components/marketplace-workflow";
import { readProfileSessionForWallet, type ProfileSession } from "@/lib/profile-session";
import { readWalletSession, type WalletSession } from "@/lib/wallet-session";

export default function ArtistDashboardPage() {
  const [wallet, setWallet] = useState<WalletSession | null>(null);
  const [profile, setProfile] = useState<ProfileSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const walletSession = readWalletSession();
    setWallet(walletSession);
    setProfile(walletSession ? readProfileSessionForWallet(walletSession.walletAddress) : null);
    setIsLoaded(true);
  }, []);

  const canOpenArtistDashboard = profile?.accountMode === "artist" || profile?.accountMode === "both";

  const checklist = useMemo(
    () => [
      { label: "Connect wallet identity", done: Boolean(wallet), icon: <Wallet size={16} /> },
      { label: "Complete display name", done: Boolean(profile?.displayName), icon: <BadgeCheck size={16} /> },
      { label: "Verify email with Google", done: profile?.emailVerificationStatus === "verified", icon: <ShieldCheck size={16} /> },
      { label: "Add Stellar payout wallet", done: Boolean(profile?.stellarPayoutWallet), icon: <FileCheck2 size={16} /> },
      { label: "Add shipping rules", done: false, icon: <Truck size={16} /> },
    ],
    [profile, wallet],
  );

  if (!isLoaded) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816] text-white">
        <BrandCube className="h-14 w-14 animate-pulse" />
      </main>
    );
  }

  if (!wallet || !profile) {
    return (
      <DashboardGate
        copy="Connect your wallet and save your setup details before opening the artist dashboard."
        title="Artist setup required"
      />
    );
  }

  if (!canOpenArtistDashboard) {
    return (
      <DashboardGate
        copy="Your current setup is buyer-only. Change your role to Artist or Buyer + Artist in setup to access seller tools."
        title="Enable artist mode"
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-5 py-6 text-white sm:px-8">
      <DashboardBackground />
      <DashboardHeader />

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 pb-16 pt-8 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <BrandCube className="h-11 w-11" />
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f54733]">Artist account</p>
                <h1 className="truncate text-2xl font-black tracking-[-0.04em]">{profile.displayName}</h1>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">
              {profile.bio || "This is your private artist workspace. Add your artist bio in setup so buyers know who created the work."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge tone="good">
                <BadgeCheck size={14} /> {profile.accountMode}
              </StatusBadge>
              <StatusBadge tone="info">
                <Zap size={14} /> Stellar Testnet
              </StatusBadge>
              <StatusBadge tone={profile.emailVerificationStatus === "verified" ? "good" : "warn"}>
                <ShieldCheck size={14} /> email {profile.emailVerificationStatus}
              </StatusBadge>
            </div>
            <ProfileDatum label="Email" value={profile.email} />
            <ProfileDatum label="Connected wallet" value={wallet.walletAddress} />
            <ProfileDatum label="Payout wallet" value={profile.stellarPayoutWallet || "Add a Stellar public key in setup"} />
            <Link className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#f54733]/40 bg-[#f54733]/16 px-5 py-3 text-sm font-black text-white transition hover:bg-[#f54733]" href="/dashboard">
              Edit account setup <ArrowRight size={16} />
            </Link>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl">
            <h2 className="text-lg font-black tracking-[-0.03em]">Seller checklist</h2>
            <div className="mt-4 space-y-3">
              {checklist.map((item) => (
                <ChecklistItem done={item.done} icon={item.icon} key={item.label} label={item.label} />
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <MarketplaceWorkflow />
          <section className="grid gap-4 md:grid-cols-4">
            <MetricCard icon={<CircleDollarSign size={20} />} label="Confirmed revenue" value="0 USDC" />
            <MetricCard icon={<ImagePlus size={20} />} label="Listed value" value="0 USDC" />
            <MetricCard icon={<ShieldCheck size={20} />} label="Certificates" value="0 issued" />
            <MetricCard icon={<PackageCheck size={20} />} label="Open orders" value="0" />
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f54733]">Create listing</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Upload your first artwork</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  This dashboard is scoped to your connected wallet. When Supabase is connected, listings and certificates will be saved under your profile, not shared mock data.
                </p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f54733] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ff6b56]" type="button">
                <Upload size={16} /> New artwork
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_160px]">
              <DashboardInput label="Artwork title" placeholder="Name your artwork" />
              <DashboardInput label="Category" placeholder="Digital Painting, Acrylic, Mixed Media" />
              <DashboardInput label="Price" placeholder="120 USDC" />
              <label className="lg:col-span-3">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">Description</span>
                <textarea className="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/24 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#f54733]/60" placeholder="Describe the artwork, signature, medium, edition, and fulfillment details." />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f54733]">Portfolio</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Your listings and certificates</h2>
              </div>
              <Link className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-black text-slate-200 transition hover:border-[#f54733]/50 hover:text-white" href="/arts">
                View marketplace <ArrowRight size={15} />
              </Link>
            </div>
            <EmptyState
              copy="No artwork has been created for this wallet yet. Your future listings will appear here after real upload storage is connected."
              icon={<ImagePlus size={28} />}
              title="No listings yet"
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f54733]">Fulfillment</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Orders needing attention</h2>
              <EmptyState
                copy="When buyers purchase your artwork or request shipping quotes, those order tasks will appear here."
                icon={<PackageCheck size={28} />}
                title="No artist orders yet"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-2xl sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f54733]">Certificate ledger</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Your Stellar references</h2>
              <EmptyState
                copy="Certificates will be issued only for artwork uploaded by this connected profile."
                icon={<LockKeyhole size={28} />}
                title="No certificates yet"
              />
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function DashboardGate({ copy, title }: { copy: string; title: string }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-6 py-10 text-white">
      <DashboardBackground />
      <section className="relative mx-auto grid min-h-[78vh] max-w-3xl place-items-center text-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-8">
          <BrandCube className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] sm:text-4xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">{copy}</p>
          <Link className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f54733] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ff6b56]" href="/dashboard">
            Go to setup <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function DashboardHeader() {
  return (
    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-2xl">
      <Link className="flex items-center gap-3" href="/">
        <BrandCube className="h-9 w-9" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/72">ArtisanS</p>
          <p className="text-xs text-slate-400">Seller workspace</p>
        </div>
      </Link>
      <nav className="hidden items-center gap-2 sm:flex">
        <Link className="rounded-full px-4 py-2 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white" href="/dashboard">
          Setup
        </Link>
        <Link className="rounded-full px-4 py-2 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white" href="/dashboard/buyer">
          Buyer
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

function ProfileDatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/24 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 break-all text-sm leading-5 text-slate-300">{value}</p>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f54733]/14 text-[#f54733]">{icon}</span>
      <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function ChecklistItem({ done = false, icon, label }: { done?: boolean; icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/24 p-3">
      <span className={done ? "text-emerald-300" : "text-slate-500"}>{icon}</span>
      <span className="text-sm font-bold text-slate-300">{label}</span>
      {done ? <span className="ml-auto text-xs font-black text-emerald-300">Done</span> : <span className="ml-auto text-xs font-black text-[#f54733]">Next</span>}
    </div>
  );
}

function DashboardInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</span>
      <input
        className="w-full rounded-2xl border border-white/10 bg-black/24 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#f54733]/60"
        placeholder={placeholder}
      />
    </label>
  );
}

function EmptyState({ copy, icon, title }: { copy: string; icon: React.ReactNode; title: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-white/14 bg-slate-950/42 p-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#f54733]/14 text-[#f54733]">{icon}</div>
      <h3 className="mt-4 text-lg font-black tracking-[-0.03em]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{copy}</p>
    </div>
  );
}

function StatusBadge({ children, tone }: { children: React.ReactNode; tone: "good" | "info" | "warn" }) {
  const color =
    tone === "good"
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
      : tone === "info"
        ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
        : "border-[#f54733]/30 bg-[#f54733]/10 text-orange-100";

  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${color}`}>{children}</span>;
}
