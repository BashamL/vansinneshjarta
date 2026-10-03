import type { Metadata } from "next";
import Link from "next/link";
import CheckoutButton from "./checkout-button";
import { checkoutConfigured } from "@/lib/stripe";
import "./order.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Beställ boken — vansinnehjärta", robots: { index: false, follow: false } };

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ avbruten?: string }> }) {
  const cancelled = (await searchParams).avbruten === "1";
  return <main className="order-page">
    <Link className="order-back" href="/">← tillbaka till boken</Link>
    <div className="order-layout">
      <div className="order-book" aria-hidden="true"><span>irma tegge</span><p>vansinnehjärta</p><small>en diktsamling</small></div>
      <section className="order-details" aria-labelledby="order-title">
        <p className="small-caps">ett exemplar att hålla i</p>
        <h1 id="order-title">vansinnehjärta</h1>
        <p className="order-intro">En tryckt diktsamling av Irma Tegge.<br />Några ord att bära med sig.</p>
        <dl className="order-totals">
          <div><dt>Boken · 1 exemplar</dt><dd>150 kr</dd></div>
          <div><dt>Frakt inom Sverige</dt><dd>30 kr</dd></div>
          <div className="order-total"><dt>Totalt</dt><dd>180 kr</dd></div>
        </dl>
        <p className="order-delivery">Leverans endast till adresser i Sverige.</p>
        <p className="order-sandbox">Testbutik — inga riktiga pengar dras och ingen bok skickas.</p>
        {cancelled && <p className="order-cancelled" role="status">Du lämnade kassan. Du kan försöka igen när du vill.</p>}
        <CheckoutButton enabled={checkoutConfigured()} />
      </section>
    </div>
  </main>;
}
