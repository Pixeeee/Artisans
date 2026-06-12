"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck, UserRound } from "lucide-react";
import {
  PROFILE_CHANGED_EVENT,
  readProfileSessionForWallet,
  type ProfileSession,
} from "@/lib/profile-session";
import {
  readWalletSession,
  type WalletSession,
} from "@/lib/wallet-session";

export function AccountIdentityBadge() {
  const [wallet, setWallet] = useState<WalletSession | null>(null);
  const [profile, setProfile] = useState<ProfileSession | null>(null);

  useEffect(() => {
    function syncIdentity() {
      const walletSession = readWalletSession();
      setWallet(walletSession);
      setProfile(walletSession ? readProfileSessionForWallet(walletSession.walletAddress) : null);
    }

    syncIdentity();
    window.addEventListener(PROFILE_CHANGED_EVENT, syncIdentity);
    window.addEventListener("storage", syncIdentity);
    return () => {
      window.removeEventListener(PROFILE_CHANGED_EVENT, syncIdentity);
      window.removeEventListener("storage", syncIdentity);
    };
  }, []);

  if (!wallet && !profile) return null;

  const name = profile?.displayName || wallet?.nickname || "Account";

  return (
    <div className="fixed right-3 top-3 z-40 hidden items-center gap-2 rounded-full border border-white/16 bg-slate-950/72 px-3 py-2 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:flex">
      <Link className="flex min-w-0 items-center gap-2" href="/dashboard">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f54733]/16 text-[#f54733]">
          <UserRound size={16} />
        </span>
        <span className="max-w-[160px] truncate text-xs font-black">{name}</span>
        {profile?.emailVerificationStatus === "verified" ? <ShieldCheck className="text-emerald-300" size={15} /> : null}
      </Link>
    </div>
  );
}
