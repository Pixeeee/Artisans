"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { BadgeCheck, ChevronRight, Loader2, Wallet, Zap } from "lucide-react";
import { BrandCube } from "@/components/brand-cube";
import { connectFreighterWallet } from "@/lib/freighter-client";
import { createWalletSession, saveWalletSession } from "@/lib/wallet-session";

type AuthMode = "login" | "signup";
type WalletState = {
  metamask?: string;
  freighter?: string;
  stellarTestnet: boolean;
};

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const copy = {
  login: {
    image: "/assets/backgroundimg/login.png",
    eyebrow: "Stellar verified marketplace",
    headline: "Discover a cutting-edge NFT marketplace",
    title: "Welcome back!",
    button: "Log in",
    switchText: "Don't have an account?",
    switchAction: "Sign up",
    route: "/log-in",
  },
  signup: {
    image: "/assets/backgroundimg/signup.png",
    eyebrow: "Create your ArtisanS identity",
    headline: "Start selling verified digital and physical art",
    title: "Create account",
    button: "Sign up",
    switchText: "Already have an account?",
    switchAction: "Log in",
    route: "/sign-up",
  },
} satisfies Record<AuthMode, Record<string, string>>;

export function AuthExperience({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wallet, setWallet] = useState<WalletState>({ stellarTestnet: true });
  const [walletMessage, setWalletMessage] = useState("Stellar Testnet ready for USDC payments");
  const [isConnecting, setIsConnecting] = useState(false);
  const active = copy[mode];

  const imageAnimationKey = mode;
  const shortWallet = useMemo(() => {
    if (!wallet.metamask) return null;
    return `${wallet.metamask.slice(0, 6)}...${wallet.metamask.slice(-4)}`;
  }, [wallet.metamask]);
  const shortFreighter = useMemo(() => {
    if (!wallet.freighter) return null;
    return `${wallet.freighter.slice(0, 6)}...${wallet.freighter.slice(-4)}`;
  }, [wallet.freighter]);

  function switchMode(nextMode: AuthMode) {
    if (nextMode === mode || isTransitioning) return;
    setIsTransitioning(true);
    setMode(nextMode);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    });
    window.setTimeout(() => {
      window.history.replaceState(null, "", copy[nextMode].route);
    }, 520);
  }

  async function connectMetaMask() {
    setIsConnecting(true);
    try {
      if (!window.ethereum) {
        setWalletMessage("MetaMask was not detected. Install it or use Stellar Testnet mode for now.");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const firstAccount = Array.isArray(accounts) && typeof accounts[0] === "string" ? accounts[0] : undefined;
      if (!firstAccount) {
        setWalletMessage("MetaMask did not return an account.");
        return;
      }

      const session = createWalletSession(firstAccount);
      if (!session) {
        setWalletMessage("MetaMask returned an invalid wallet address.");
        return;
      }

      saveWalletSession(session);
      setWallet((current) => ({ ...current, metamask: session.walletAddress }));
      setWalletMessage(`Wallet connected as ${session.nickname}. Opening your dashboard.`);
      window.setTimeout(() => {
        router.push("/dashboard");
      }, 180);
    } catch {
      setWalletMessage("MetaMask connection was cancelled or failed.");
    } finally {
      setIsConnecting(false);
    }
  }

  async function connectFreighter() {
    setIsConnecting(true);
    try {
      const result = await connectFreighterWallet();
      if (!result.ok) {
        setWalletMessage(result.error);
        return;
      }

      setWallet((current) => ({ ...current, freighter: result.session.walletAddress, stellarTestnet: true }));
      setWalletMessage(
        `${result.network && !result.network.toLowerCase().includes("test") ? "Switch Freighter to Testnet later. " : ""}Freighter connected as ${result.session.nickname}. Opening your dashboard.`,
      );
      window.setTimeout(() => {
        router.push("/dashboard");
      }, 180);
    } catch {
      setWalletMessage("Freighter connection was cancelled or failed.");
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#080912] px-5 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_16%,rgba(245,71,51,0.26),transparent_24%),radial-gradient(circle_at_76%_14%,rgba(71,87,255,0.28),transparent_30%),linear-gradient(135deg,#03040a_0%,#17143a_52%,#0a0a12_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

      <section className="relative w-full max-w-[980px] overflow-hidden rounded-[18px] border border-white/10 bg-[#202020] shadow-[0_34px_110px_rgba(0,0,0,0.48)]">
        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />
        <div className="grid min-h-[560px] lg:grid-cols-[1.08fr_0.92fr]">
          <VisualPanel active={active} imageAnimationKey={imageAnimationKey} isTransitioning={isTransitioning} mode={mode} />
          <FormPanel
            active={active}
            connectMetaMask={connectMetaMask}
            connectFreighter={connectFreighter}
            isConnecting={isConnecting}
            isTransitioning={isTransitioning}
            mode={mode}
            setWallet={setWallet}
            setWalletMessage={setWalletMessage}
            shortWallet={shortWallet}
            shortFreighter={shortFreighter}
            switchMode={switchMode}
            wallet={wallet}
            walletMessage={walletMessage}
          />
        </div>
      </section>

      <style jsx global>{`
        .auth-input {
          width: 100%;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.12);
          padding: 10px 12px;
          color: white;
          outline: none;
          font-size: 13px;
          transition:
            border-color 180ms ease,
            background-color 180ms ease,
            box-shadow 180ms ease;
        }

        .auth-input::placeholder {
          color: rgba(255, 255, 255, 0.28);
        }

        .auth-input:focus {
          border-color: rgba(141, 123, 255, 0.72);
          background: rgba(255, 255, 255, 0.16);
          box-shadow: 0 0 0 3px rgba(118, 102, 245, 0.16);
        }

        .auth-smooth-panel {
          animation: auth-smooth-enter 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
          will-change: opacity, transform, filter;
        }

        @keyframes auth-smooth-enter {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.985);
            filter: blur(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .auth-smooth-panel {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}

function VisualPanel({
  active,
  imageAnimationKey,
  isTransitioning,
  mode,
}: {
  active: (typeof copy)[AuthMode];
  imageAnimationKey: string;
  isTransitioning: boolean;
  mode: AuthMode;
}) {
  return (
    <div className={`relative flex min-h-[500px] flex-col overflow-hidden p-7 sm:p-10 ${mode === "signup" ? "lg:col-start-2" : ""}`}>
            <div className="flex items-center gap-3">
              <BrandCube className="h-10 w-10" />
              <span className="text-sm font-black uppercase tracking-[0.18em] text-white/50">ArtisanS</span>
            </div>

            <div
              className={`auth-smooth-panel mt-9 max-w-[390px] transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isTransitioning ? "translate-y-2 scale-[0.985] opacity-0 blur-sm" : "translate-y-0 scale-100 opacity-100 blur-0"
              }`}
              key={`auth-copy-${mode}`}
            >
              <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[#f54733]">{active.eyebrow}</p>
              <h1 className="text-3xl font-black leading-[1.05] tracking-[-0.04em] sm:text-4xl">{active.headline}</h1>
              <p className="mt-4 text-sm leading-6 text-white/54">
                Authenticate your account, connect a collector wallet, and keep Stellar Testnet visible for certificate and USDC payment flows.
              </p>
            </div>

            <div className="relative mt-8 min-h-[230px] flex-1 sm:min-h-[280px]">
              <div
                className={`auth-smooth-panel absolute inset-x-0 bottom-0 overflow-hidden rounded-t-[42px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isTransitioning ? "translate-y-28 scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100"
                }`}
                key={imageAnimationKey}
              >
                <Image
                  alt={`${mode} background art`}
                  className="mx-auto h-full max-h-[330px] w-full object-contain object-bottom drop-shadow-[0_26px_48px_rgba(0,0,0,0.55)]"
                  height={500}
                  priority
                  src={active.image}
                  width={520}
                />
              </div>
            </div>
    </div>
  );
}

function FormPanel({
  active,
  connectMetaMask,
  connectFreighter,
  isConnecting,
  isTransitioning,
  mode,
  setWallet,
  setWalletMessage,
  shortWallet,
  shortFreighter,
  switchMode,
  wallet,
  walletMessage,
}: {
  active: (typeof copy)[AuthMode];
  connectMetaMask: () => Promise<void>;
  connectFreighter: () => Promise<void>;
  isConnecting: boolean;
  isTransitioning: boolean;
  mode: AuthMode;
  setWallet: Dispatch<SetStateAction<WalletState>>;
  setWalletMessage: Dispatch<SetStateAction<string>>;
  shortWallet: string | null;
  shortFreighter: string | null;
  switchMode: (nextMode: AuthMode) => void;
  wallet: WalletState;
  walletMessage: string;
}) {
  return (
    <div className={`relative overflow-hidden px-7 pb-8 pt-3 sm:px-10 lg:px-11 lg:py-16 ${mode === "signup" ? "lg:col-start-1 lg:row-start-1" : ""}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_35%,rgba(255,255,255,0.05),transparent_34%)]" />
            <div
              className={`auth-smooth-panel relative z-10 mx-auto max-w-[340px] transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isTransitioning ? "translate-y-3 scale-[0.985] opacity-0 blur-sm" : "translate-y-0 scale-100 opacity-100 blur-0"
              }`}
              key={`auth-form-${mode}`}
            >
              <div className="mb-7 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-[-0.03em]">{active.title}</h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-black text-emerald-200">
                  <BadgeCheck size={12} /> Testnet
                </span>
              </div>

              <form className="space-y-3">
                {mode === "signup" ? (
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-bold text-white/50">Artist or buyer name</span>
                    <input className="auth-input" placeholder="Mara Velasquez" type="text" />
                  </label>
                ) : null}
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold text-white/50">Email</span>
                  <input className="auth-input" placeholder="artisan@email.com" type="email" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold text-white/50">Password</span>
                  <input className="auth-input" placeholder="Password" type="password" />
                </label>
                {mode === "login" ? (
                  <div className="flex justify-end">
                    <button className="text-[11px] font-bold text-[#8d7bff] transition hover:text-white" type="button">
                      Forgot Password?
                    </button>
                  </div>
                ) : null}
                <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-[#7666f5] px-4 py-3 text-sm font-black text-white transition hover:bg-[#8b7dff]" type="button">
                  {active.button} <ChevronRight size={15} />
                </button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[11px] font-bold text-white/34">or connect wallet</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid gap-2">
                <button
                  className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-bold text-white transition hover:border-[#f54733]/50 hover:bg-[#f54733]/10"
                  onClick={connectMetaMask}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2">
                    {isConnecting ? <Loader2 className="animate-spin" size={16} /> : <Wallet size={16} />}
                    {shortWallet ? `MetaMask ${shortWallet}` : "Connect MetaMask"}
                  </span>
                  <span className="text-xs text-white/38">EVM</span>
                </button>
                <button
                  className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-bold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                  onClick={connectFreighter}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2">
                    {isConnecting ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                    {shortFreighter ? `Freighter ${shortFreighter}` : "Connect Freighter"}
                  </span>
                  <span className="text-xs text-white/38">Stellar</span>
                </button>
                <button
                  className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm font-bold transition ${
                    wallet.stellarTestnet
                      ? "border-cyan-300/28 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.04] text-white"
                  }`}
                  onClick={() => {
                    setWallet((current) => ({ ...current, stellarTestnet: !current.stellarTestnet }));
                    setWalletMessage(
                      wallet.stellarTestnet
                        ? "Stellar Testnet disabled for this session."
                        : "Stellar Testnet ready for USDC payments",
                    );
                  }}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2">
                    <Zap size={16} />
                    Stellar Testnet
                  </span>
                  <span className="text-xs text-white/48">{wallet.stellarTestnet ? "Active" : "Off"}</span>
                </button>
              </div>

              <p className="mt-3 min-h-8 text-xs leading-5 text-white/44">{walletMessage}</p>

              <p className="mt-5 text-center text-xs font-bold text-white/58">
                {active.switchText}{" "}
                <button
                  className="text-[#8d7bff] transition hover:text-white"
                  onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                  type="button"
                >
                  {active.switchAction}
                </button>
              </p>
            </div>
    </div>
  );
}
