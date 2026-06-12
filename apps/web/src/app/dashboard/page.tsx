"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Brush,
  ExternalLink,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  UserRoundCog,
  Wallet,
  Zap,
} from "lucide-react";
import { BrandCube } from "@/components/brand-cube";
import { MarketplaceWorkflow } from "@/components/marketplace-workflow";
import {
  createUsernameCandidate,
  readProfileSessionForWallet,
  saveProfileSession,
  validateProfileDraft,
  type AccountMode,
} from "@/lib/profile-session";
import {
  clearWalletSession,
  readWalletSession,
  revokeMetaMaskAccountAccess,
  type WalletSession,
} from "@/lib/wallet-session";

const roles = [
  {
    value: "buyer",
    title: "Buyer",
    copy: "Collect digital art, request shipping quotes, and verify certificates.",
  },
  {
    value: "artist",
    title: "Artist",
    copy: "Publish artwork, set prices, issue certificates, and manage fulfillment.",
  },
  {
    value: "both",
    title: "Buyer + Artist",
    copy: "Use one wallet identity for collecting and selling on ArtisanS.",
  },
] satisfies Array<{ value: AccountMode; title: string; copy: string }>;

export default function WalletDashboardPage() {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [accountMode, setAccountMode] = useState<AccountMode>("buyer");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [stellarPayoutWallet, setStellarPayoutWallet] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profileMessage, setProfileMessage] = useState<{ tone: "good" | "warn"; text: string } | null>(null);

  useEffect(() => {
    const walletSession = readWalletSession();
    const profileSession = walletSession ? readProfileSessionForWallet(walletSession.walletAddress) : null;

    setSession(walletSession);
    if (walletSession) {
      setUsername(profileSession?.username ?? createUsernameCandidate(walletSession.nickname));
      setDisplayName(profileSession?.displayName ?? walletSession.nickname);
      setEmail(profileSession?.email ?? "");
      setAccountMode(profileSession?.accountMode ?? "buyer");
      setStellarPayoutWallet(profileSession?.stellarPayoutWallet ?? "");
      setLocation(profileSession?.location ?? "");
      setBio(profileSession?.bio ?? "");
    }
    setIsLoaded(true);
  }, []);

  const connectedAt = useMemo(() => {
    if (!session) return "";
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(session.connectedAt));
  }, [session]);

  async function disconnectWallet() {
    await revokeMetaMaskAccountAccess();
    clearWalletSession();
    setSession(null);
  }

  function saveProfileDetails() {
    if (!session) return;

    const validated = validateProfileDraft({
      walletAddress: session.walletAddress,
      username,
      displayName,
      email,
      accountMode,
      stellarPayoutWallet,
      location,
      bio,
    });

    if (!validated.ok) {
      setProfileMessage({ tone: "warn", text: validated.errors.join(" ") });
      return;
    }

    saveProfileSession(validated.value);
    setUsername(validated.value.username);
    setDisplayName(validated.value.displayName);
    setEmail(validated.value.email);
    setStellarPayoutWallet(validated.value.stellarPayoutWallet ?? "");
    setLocation(validated.value.location ?? "");
    setBio(validated.value.bio ?? "");
    setProfileMessage({
      tone: "good",
      text: "Profile saved. Your display name now appears while browsing ArtisanS.",
    });
  }

  if (!isLoaded) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816] text-white">
        <BrandCube className="h-14 w-14 animate-pulse" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050816] px-6 py-10 text-white">
        <DashboardBackground />
        <section className="relative mx-auto grid min-h-[78vh] max-w-3xl place-items-center text-center">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-8">
            <BrandCube className="mx-auto h-16 w-16" />
            <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Connect wallet first</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
              ArtisanS uses your connected wallet as the temporary MVP nickname. Connect through the login page, then configure your buyer or artist details here.
            </p>
            <Link
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f54733] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ff6b56]"
              href="/log-in"
            >
              Go to login <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-5 py-6 text-white sm:px-8">
      <DashboardBackground />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-2xl">
        <Link className="flex items-center gap-3" href="/">
          <BrandCube className="h-9 w-9" />
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/72">ArtisanS</p>
            <p className="text-xs text-slate-400">Wallet setup dashboard</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-slate-200 transition hover:border-[#f54733]/50 hover:text-white"
            href="/arts"
          >
            Arts <ArrowRight size={14} />
          </Link>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-slate-200 transition hover:border-[#f54733]/50 hover:text-white"
            onClick={disconnectWallet}
            type="button"
          >
            <LogOut size={15} /> Disconnect
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 pb-16 pt-8 lg:grid-cols-[430px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-white/10 bg-slate-950/72 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
              <BadgeCheck size={14} /> Connected
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">
              <Zap size={14} /> Stellar Testnet
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">
            Welcome, <span className="text-[#f54733]">{displayName || session.nickname}</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">
            Your wallet nickname is used only as a temporary ArtisanS identity. Complete your profile below to choose buyer, artist, or both roles before real Supabase auth is connected.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-3 text-sm font-black">
              <Wallet className="text-[#f54733]" size={18} />
              Public wallet
            </div>
            <p className="mt-3 break-all rounded-2xl bg-black/24 p-3 font-mono text-xs leading-5 text-slate-300">
              {session.walletAddress}
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-500">Connected {connectedAt}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Public profile</p>
            <p className="mt-3 text-sm font-black text-white">@{username || "username"}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Public viewers only see your username and wallet address. Your email stays private to account verification.
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            <SecurityNote icon={<LockKeyhole size={17} />} title="No private keys stored" copy="The MVP stores your active public wallet in session storage and your profile draft in local browser storage." />
            <SecurityNote icon={<ShieldCheck size={17} />} title="Production upgrade required" copy="Before launch, connect this flow to signed wallet nonce auth, Supabase profiles, RLS, and server-side account linking." />
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <UserRoundCog className="text-[#f54733]" size={24} />
              <div>
                <h2 className="text-lg font-black tracking-[-0.03em]">Update</h2>
                <p className="text-sm text-slate-400">Username, role, and private contact details.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {roles.map((role) => (
                <button
                  className={`rounded-2xl border p-3 text-left transition ${
                    accountMode === role.value
                      ? "border-[#f54733]/70 bg-[#f54733]/14 shadow-[0_0_34px_rgba(245,71,51,0.16)]"
                      : "border-white/10 bg-white/[0.04] hover:border-white/24"
                  }`}
                  key={role.value}
                  onClick={() => setAccountMode(role.value)}
                  type="button"
                >
                  <span className="text-sm font-black">{role.title}</span>
                  <span className="mt-2 block text-xs leading-5 text-slate-400">{role.copy}</span>
                </button>
              ))}
            </div>

            <form className="mt-6 grid gap-4">
              <ProfileField label="Username" onChange={setUsername} placeholder="artisan_creator" value={username} />
              <ProfileField label="Display name" onChange={setDisplayName} placeholder={session.nickname} value={displayName} />
              <ProfileField label="Contact email" onChange={setEmail} placeholder="artist@email.com" type="email" value={email} />
              <ProfileField
                label="Stellar payout wallet"
                onChange={setStellarPayoutWallet}
                placeholder="G... public Stellar address"
                value={stellarPayoutWallet}
              />
              <ProfileField label="Location" onChange={setLocation} placeholder="City, Country" value={location} />
              <label>
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">Bio / collector note</span>
                <textarea
                  className="min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/24 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#f54733]/60"
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Tell buyers and artists who you are. This will become your ArtisanS public profile."
                  value={bio}
                />
              </label>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-cyan-100">
                  <ShieldCheck size={16} /> Google email verification
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Planned for the Supabase auth phase: Gmail accounts should verify through Google OAuth before trusted email actions, payouts, or seller verification.
                </p>
              </div>
              {profileMessage ? (
                <p
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                    profileMessage.tone === "good"
                      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                      : "border-[#f54733]/30 bg-[#f54733]/10 text-orange-100"
                  }`}
                >
                  {profileMessage.text}
                </p>
              ) : null}
              <button
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#f54733]/40 bg-[#f54733] px-5 py-4 text-sm font-black text-white shadow-[0_18px_44px_rgba(245,71,51,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ff6b56]"
                onClick={saveProfileDetails}
                type="button"
              >
                Save profile details <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </aside>

        <section className="space-y-6">
          <MarketplaceWorkflow />
          <div className="grid gap-4 md:grid-cols-2">
            <DashboardSummaryCard
              copy="Your public identity shows username and wallet only. Email is kept for private verification."
              title="Profile"
              value={`@${username || "username"}`}
            />
            <DashboardSummaryCard
              copy="View purchased art, order states, digital unlocks, and physical shipping quotes."
              title="Orders"
              value="Buyer activity"
            />
            <DashboardLink
              copy="Review orders, unlocked digital files, shipping quotes, and certificate history."
              href="/dashboard/buyer"
              icon={<Wallet size={21} />}
              title="Open buyer dashboard"
            />
            <DashboardLink
              copy="Create listings, manage certificates, track sales, and configure seller details."
              href="/dashboard/artist"
              icon={<Brush size={21} />}
              title="Open artist dashboard"
            />
            <DashboardSummaryCard
              copy="Collections will show artwork created under your own wallet once Supabase uploads are connected."
              title="View collections"
              value="No public collection yet"
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function DashboardBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(245,71,51,0.22),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(37,99,235,0.22),transparent_30%),linear-gradient(135deg,#050816_0%,#08111f_58%,#120b14_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_70px] opacity-30" />
    </>
  );
}

function ProfileField({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</span>
      <input
        className="w-full rounded-2xl border border-white/10 bg-black/24 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#f54733]/60"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function SecurityNote({ copy, icon, title }: { copy: string; icon: React.ReactNode; title: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <span className="mt-0.5 text-cyan-200">{icon}</span>
      <div>
        <p className="text-sm font-black">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">{copy}</p>
      </div>
    </div>
  );
}

function DashboardLink({ copy, href, icon, title }: { copy: string; href: string; icon: React.ReactNode; title: string }) {
  return (
    <Link
      className="group rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:-translate-y-0.5 hover:border-[#f54733]/50 hover:bg-slate-900/80"
      href={href}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f54733]/14 text-[#f54733]">{icon}</span>
      <span className="mt-4 flex items-center justify-between gap-4 text-base font-black tracking-[-0.02em]">
        {title}
        <ExternalLink className="text-slate-500 transition group-hover:text-white" size={18} />
      </span>
      <span className="mt-2 block text-xs leading-5 text-slate-400">{copy}</span>
    </Link>
  );
}

function DashboardSummaryCard({ copy, title, value }: { copy: string; title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f54733]">{title}</p>
      <p className="mt-2 text-lg font-black tracking-[-0.03em] text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">{copy}</p>
    </div>
  );
}
