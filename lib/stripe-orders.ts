import type Stripe from "stripe";
import { BOOK, matchesBookOrder } from "./book-commerce";

export const ORDER_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
]);

/** Stripe is the durable order record for this small, manually shipped shop.
 * No email, stock change, or shipment is triggered by the return page.
 * These metadata writes converge on the same value on retries/concurrent events.
 */
export async function recordBookPayment(stripe: Stripe, sessionId: string, priceId: string) {
  // Read current state so late/out-of-order events cannot downgrade a paid order.
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.metadata?.integration !== BOOK.integration) return "ignored";
  if (session.payment_status !== "paid") return "unpaid";
  if (!matchesBookOrder(session)) throw new Error("Order does not match the configured book.");

  const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 2 });
  if (items.has_more || items.data.length !== 1 || items.data[0].quantity !== 1 || items.data[0].price?.id !== priceId) {
    throw new Error("Unexpected order items.");
  }
  const paymentIntent = typeof session.payment_intent === "string"
    ? session.payment_intent : session.payment_intent?.id;
  if (!paymentIntent) throw new Error("Paid order is missing its payment reference.");

  // Preserve any independently maintained shipping/refund metadata. This is a
  // payment verification marker, never an instruction to ship a sandbox order.
  await stripe.paymentIntents.update(paymentIntent, {
    metadata: { book_payment_verified: "true", book_checkout_session: session.id, book_sandbox: "true" },
  });
  await stripe.checkout.sessions.update(session.id, {
    metadata: { book_payment_verified: "true" },
  });
  return "verified";
}
