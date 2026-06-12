import {
  BadgeCheck,
  FileCheck2,
  HandCoins,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

const workflowSteps = [
  {
    title: "Seller verified",
    copy: "Artist profile, email, wallet, payout details, and admin review.",
    icon: BadgeCheck,
  },
  {
    title: "Artwork submitted",
    copy: "Digital or physical art details, preview assets, price, and license.",
    icon: FileCheck2,
  },
  {
    title: "Proof created",
    copy: "Metadata hash plus Stellar Testnet certificate reference.",
    icon: ShieldCheck,
  },
  {
    title: "Listing reviewed",
    copy: "Admin checks authenticity, policy risk, and duplicate reports.",
    icon: SearchCheck,
  },
  {
    title: "Buyer purchases",
    copy: "USDC checkout, certificate view, and private order record.",
    icon: ShoppingBag,
  },
  {
    title: "Deliver and payout",
    copy: "Digital unlock or physical shipping, then artist payout.",
    icon: PackageCheck,
  },
];

export function MarketplaceWorkflow() {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/64 p-4 backdrop-blur-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#f54733]">Trust workflow</p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-white">How ArtisanS ships verified art</h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100">
          <HandCoins size={14} /> USDC + Stellar proof
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article className="rounded-xl border border-white/10 bg-white/[0.045] p-4" key={step.title}>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f54733]/14 text-[#f54733]">
                  <Icon size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Step {index + 1}</p>
                  <h3 className="truncate text-sm font-black text-white">{step.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">{step.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
