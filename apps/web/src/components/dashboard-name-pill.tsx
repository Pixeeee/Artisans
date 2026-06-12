"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import {
  PROFILE_CHANGED_EVENT,
  readProfileSessionForWallet,
  type ProfileSession,
} from "@/lib/profile-session";
import { readWalletSession, type WalletSession } from "@/lib/wallet-session";

export function DashboardNamePill() {
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

  const name = profile?.displayName || wallet?.nickname || "Profile";

  return (
    <Link
      className="inline-flex min-w-[152px] max-w-[240px] items-center justify-center gap-2 rounded-full border border-[#f54733]/45 bg-[#f54733]/16 px-4 py-2 text-sm font-black text-white shadow-[0_12px_32px_rgba(245,71,51,0.12)] transition hover:bg-[#f54733]"
      href="/dashboard"
    >
      <UserRound size={15} />
      <span className="truncate">{name}</span>
    </Link>
  );
}
