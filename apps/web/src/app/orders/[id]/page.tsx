import Link from "next/link";
import { notFound } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { StatusPill } from "@/components/status-pill";
import {
  canShipPhysicalOrder,
  canUnlockDigitalFile,
  demoArtworks,
  demoMessages,
  demoOrders,
  demoShippingQuotes,
} from "@artisans/shared";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = demoOrders.find((entry) => entry.id === id);
  if (!order) notFound();

  const artwork = demoArtworks.find((entry) => entry.id === order.artworkId);
  const messages = demoMessages.filter((message) => message.orderId === order.id);
  const quote = demoShippingQuotes.find((entry) => entry.orderId === order.id);
  const unlocked = canUnlockDigitalFile({
    orderType: order.orderType,
    orderStatus: order.status,
    paymentStatus: order.paymentStatus,
  });
  const canShip = canShipPhysicalOrder({
    orderType: order.orderType,
    orderStatus: order.status,
    paymentStatus: order.paymentStatus,
  });

  return (
    <main className="min-h-screen bg-[#090909] px-5 pb-16 pt-28">
      <MainNav />
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-2">
          <StatusPill tone={order.paymentStatus === "confirmed" ? "good" : "warn"}>{order.paymentStatus}</StatusPill>
          <StatusPill>{order.status}</StatusPill>
          <StatusPill>{order.orderType}</StatusPill>
        </div>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] md:text-5xl">{artwork?.title}</h1>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="artisan-card rounded-lg p-5">
            <h2 className="text-2xl font-black">checkout</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <dt>Artwork</dt>
                <dd>{order.subtotalUsdc} USDC</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <dt>Shipping</dt>
                <dd>{order.shippingUsdc} USDC</dd>
              </div>
              <div className="flex justify-between text-lg font-black">
                <dt>Total</dt>
                <dd>{order.totalUsdc} USDC</dd>
              </div>
            </dl>
            {quote ? (
              <div className="mt-5 rounded-lg border border-white/12 bg-black/26 p-4 text-sm leading-6 text-white/68">
                Shipping quote: {quote.method}, {quote.amountUsdc} USDC from {quote.originCountry} to {quote.destinationCountry}.
              </div>
            ) : null}
            <Link className="mt-5 inline-flex rounded-full bg-[var(--artisans-orange)] px-6 py-3 text-sm font-black" href="/api/payments/stellar/build">
              build Stellar payment
            </Link>
            <p className="mt-4 text-sm leading-6 text-white/58">
              Digital unlock: {unlocked ? "available" : "blocked until confirmed payment"}. Physical shipping: {canShip ? "allowed" : "blocked until confirmed payment"}.
            </p>
          </section>

          <section className="artisan-card rounded-lg p-5">
            <h2 className="text-2xl font-black">order conversation</h2>
            <div className="mt-5 space-y-3">
              {messages.map((message) => (
                <div className={`rounded-lg p-4 text-sm ${message.senderRole === "artist" ? "bg-white/12" : "bg-[var(--artisans-orange)]/20"}`} key={message.id}>
                  <p className="text-xs font-bold uppercase text-white/48">{message.senderRole}</p>
                  <p className="mt-1 leading-6 text-white/76">{message.body}</p>
                </div>
              ))}
            </div>
            <form className="mt-5 flex gap-3">
              <input className="min-w-0 flex-1 rounded-full border border-white/12 bg-black/34 px-4 py-3 text-sm outline-none" placeholder="Message about shipping, files, or proof" />
              <button className="rounded-full bg-white px-5 py-3 font-black text-black" type="button">
                send
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
