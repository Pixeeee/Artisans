"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Loader2, ShieldAlert, Wallet, Zap } from "lucide-react";
import { signFreighterTransaction } from "@/lib/freighter-client";
import { SOROSWAP_TESTNET } from "@/lib/soroswap/constants";
import { readWalletSession, type WalletSession } from "@/lib/wallet-session";

type QuoteState =
  | { status: "idle"; message: string }
  | { status: "loading"; message: string }
  | { status: "ready"; message: string; xdr: string }
  | { status: "error"; message: string };

export function SoroswapConverter() {
  const [wallet, setWallet] = useState<WalletSession | null>(null);
  const [amountXlm, setAmountXlm] = useState("1");
  const [quoteState, setQuoteState] = useState<QuoteState>({
    status: "idle",
    message: "Convert XLM to USDC through Soroswap on Stellar Testnet.",
  });
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    function syncWallet() {
      setWallet(readWalletSession());
    }

    syncWallet();
    window.addEventListener("storage", syncWallet);
    return () => window.removeEventListener("storage", syncWallet);
  }, []);

  const canUseFreighter = wallet?.provider === "freighter";
  const shortWallet = useMemo(() => {
    if (!wallet) return "No wallet";
    return `${wallet.walletAddress.slice(0, 6)}...${wallet.walletAddress.slice(-4)}`;
  }, [wallet]);

  async function requestQuote() {
    setTxHash("");
    setQuoteState({ status: "loading", message: "Requesting Soroswap quote and swap transaction..." });

    try {
      const response = await fetch("/api/soroswap/quote", {
        body: JSON.stringify({
          amountXlm,
          slippageBps: "50",
          walletAddress: wallet?.walletAddress,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string; setup?: string; xdr?: string };

      if (!response.ok || !payload.xdr) {
        setQuoteState({
          status: "error",
          message: payload.setup ? `${payload.error} ${payload.setup}` : payload.error ?? "Soroswap quote failed.",
        });
        return;
      }

      setQuoteState({
        status: "ready",
        message: "Quote ready. Sign the transaction in Freighter to swap XLM to USDC.",
        xdr: payload.xdr,
      });
    } catch {
      setQuoteState({ status: "error", message: "Could not reach the ArtisanS Soroswap quote API." });
    }
  }

  async function signAndSubmit() {
    if (quoteState.status !== "ready" || !wallet) return;
    setQuoteState({ ...quoteState, message: "Opening Freighter for signature..." });

    try {
      const signedXdr = await signFreighterTransaction(
        quoteState.xdr,
        wallet.walletAddress,
        SOROSWAP_TESTNET.networkPassphrase,
      );
      setQuoteState({ ...quoteState, message: "Submitting signed swap through Soroswap..." });

      const response = await fetch("/api/soroswap/send", {
        body: JSON.stringify({ signedXdr }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string; result?: { hash?: string } };

      if (!response.ok) {
        setQuoteState({ status: "error", message: payload.error ?? "Soroswap submission failed." });
        return;
      }

      setTxHash(payload.result?.hash ?? "Submitted");
      setQuoteState({
        status: "idle",
        message: "Swap submitted. Wait for Stellar finality before spending the USDC.",
      });
    } catch (error) {
      setQuoteState({
        status: "error",
        message: error instanceof Error ? error.message : "Freighter signing failed.",
      });
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-100">
          <ArrowRightLeft size={19} />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100">Soroswap converter</p>
          <h2 className="text-lg font-black tracking-[-0.03em]">XLM to USDC</h2>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/24 p-3">
        <div className="flex items-center gap-2 text-xs font-black text-slate-300">
          <Wallet size={15} /> {shortWallet}
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Uses Soroswap Testnet contracts. XLM SAC: {SOROSWAP_TESTNET.xlmSac.slice(0, 8)}...
          USDC SAC: {SOROSWAP_TESTNET.usdcSac.slice(0, 8)}...
        </p>
      </div>

      {!canUseFreighter ? (
        <div className="mt-4 rounded-2xl border border-[#f54733]/30 bg-[#f54733]/10 p-3 text-xs leading-5 text-orange-100">
          <div className="mb-1 flex items-center gap-2 font-black">
            <ShieldAlert size={15} /> Freighter required
          </div>
          Connect with Freighter to sign Stellar swap transactions. MetaMask cannot sign Stellar Soroban swaps.
        </div>
      ) : null}

      <label className="mt-4 block">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">XLM amount</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/24 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60"
          inputMode="decimal"
          onChange={(event) => setAmountXlm(event.target.value)}
          placeholder="1.0000000"
          value={amountXlm}
        />
      </label>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canUseFreighter || quoteState.status === "loading"}
          onClick={requestQuote}
          type="button"
        >
          {quoteState.status === "loading" ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
          Get quote
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:border-cyan-300/60 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canUseFreighter || quoteState.status !== "ready"}
          onClick={signAndSubmit}
          type="button"
        >
          Sign and swap
        </button>
      </div>

      <p
        className={`mt-3 min-h-10 rounded-2xl border px-3 py-2 text-xs leading-5 ${
          quoteState.status === "error"
            ? "border-[#f54733]/30 bg-[#f54733]/10 text-orange-100"
            : "border-white/10 bg-black/18 text-slate-400"
        }`}
      >
        {quoteState.message}
      </p>

      {txHash ? <p className="mt-2 break-all text-xs font-bold text-emerald-200">Transaction: {txHash}</p> : null}
    </section>
  );
}
