"use client";

import { useRef, useState } from "react";
import ArrowIcon from "../arrow-icon";

export default function CheckoutButton({ enabled }: { enabled: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const attempt = useRef<string | null>(null);

  async function openCheckout() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    attempt.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: attempt.current }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Kassan kunde inte öppnas.");
      const destination = new URL(result.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com") throw new Error("Kassan kunde inte öppnas.");
      window.location.assign(destination.href);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Försök igen om en stund.");
      busy.current = false;
      setPending(false);
    }
  }

  return <>
    <button className="order-button" type="button" disabled={!enabled || pending} onClick={openCheckout}>
      {pending ? "öppnar kassan…" : "till testkassan"}<ArrowIcon direction="right" />
    </button>
    <p className="order-message" role="status" aria-live="polite">
      {error || (!enabled ? "Testkassan öppnar snart." : "Betalningen hanteras av Stripe.")}
    </p>
  </>;
}
