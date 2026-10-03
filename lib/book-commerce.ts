import type Stripe from "stripe";

export const BOOK = {
  title: "vansinnehjärta",
  currency: "sek",
  price: 15_000,
  shipping: 3_000,
  quantity: 1,
  integration: "vansinnehjarta_book_mqzvktpa",
} as const;

export function isSandboxKey(key: string | undefined): boolean {
  return Boolean(key && /^(sk|rk)_test_[A-Za-z0-9]+$/.test(key));
}

export function checkoutParameters(priceId: string, origin: string): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    locale: "sv",
    integration_identifier: BOOK.integration,
    line_items: [{ price: priceId, quantity: BOOK.quantity }],
    shipping_address_collection: { allowed_countries: ["SE"] },
    shipping_options: [{ shipping_rate_data: {
      type: "fixed_amount",
      fixed_amount: { amount: BOOK.shipping, currency: BOOK.currency },
      display_name: "Frakt inom Sverige",
    } }],
    // Stripe selects eligible methods from the account's Dashboard settings.
    metadata: { integration: BOOK.integration, edition: "printed", quantity: "1" },
    payment_intent_data: {
      metadata: { integration: BOOK.integration, edition: "printed", quantity: "1" },
      description: "vansinnehjärta — ett tryckt exemplar, inklusive frakt inom Sverige",
    },
    success_url: `${origin}/bestall/tack?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/bestall?avbruten=1`,
  };
}

export function matchesBookOrder(session: Stripe.Checkout.Session): boolean {
  return !session.livemode && session.mode === "payment" &&
    session.metadata?.integration === BOOK.integration &&
    session.currency === BOOK.currency && session.amount_subtotal === BOOK.price &&
    session.amount_total === BOOK.price + BOOK.shipping &&
    session.total_details?.amount_shipping === BOOK.shipping &&
    session.collected_information?.shipping_details?.address?.country === "SE";
}
