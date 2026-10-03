import { stripeClient } from "@/lib/stripe";
import { ORDER_EVENTS, recordBookPayment } from "@/lib/stripe-orders";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_BOOK_PRICE_ID) return new Response(null, { status: 503 });
  if (!signature) return new Response(null, { status: 400 });
  const raw = await request.text();
  if (raw.length > 131_072) return new Response(null, { status: 413 });

  const stripe = stripeClient();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (event.livemode) return new Response(null, { status: 400 });
  if (!ORDER_EVENTS.has(event.type)) return Response.json({ received: true });

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    await recordBookPayment(stripe, session.id, process.env.STRIPE_BOOK_PRICE_ID);
    return Response.json({ received: true });
  } catch {
    // A non-2xx response makes Stripe retry, including partial metadata writes.
    console.error("Sandbox order verification failed; delivery must be retried.");
    return new Response(null, { status: 500 });
  }
}
