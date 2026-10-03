import type { Metadata } from "next";
import Link from "next/link";
import { stripeClient } from "@/lib/stripe";
import { matchesBookOrder } from "@/lib/book-commerce";
import "../order.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Din testbeställning — vansinnehjärta", robots: { index: false, follow: false } };

export default async function ThankYou({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: id } = await searchParams;
  let status: "paid" | "pending" | "unavailable" = "unavailable";
  if (id && /^cs_test_[A-Za-z0-9]+$/.test(id) && id.length < 255) {
    try {
      const session = await stripeClient().checkout.sessions.retrieve(id);
      if (matchesBookOrder(session) && session.status === "complete") {
        status = session.payment_status === "paid" ? "paid" : "pending";
      }
    } catch { /* A return URL is not proof of payment. */ }
  }
  return <main className="order-page order-receipt">
    <Link className="order-back" href="/">← tillbaka till boken</Link>
    <section>
      <p className="small-caps">vansinnehjärta · testbutik</p>
      <h1>{status === "paid" ? "tack, från hjärtat." : status === "pending" ? "vi väntar på betalningen." : "vi kunde inte visa din beställning."}</h1>
      <p>{status === "paid" ? "Din testbetalning på 180 kr är genomförd." : status === "pending" ? "Betalningen behandlas fortfarande. Du kan uppdatera sidan om en stund." : "Gå tillbaka till beställningen eller försök uppdatera sidan."}</p>
      <p className="order-sandbox">Det här är ett test. Inga riktiga pengar dras och ingen bok skickas.</p>
      <Link className="read-link" href="/#dikter">stanna en stund bland dikterna →</Link>
    </section>
  </main>;
}
